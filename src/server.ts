/* eslint-disable no-invalid-this */
import * as fs from 'fs';
import * as sqlite3 from 'sqlite3';
import color from 'colorts';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import dgram from 'dgram';
import { Packet } from './util/packet';

import { DataUtil } from './util/dataUtil';

export class KcpServer {
  server: dgram.Socket;
  dataUtil: DataUtil = new DataUtil();
  static initialKeyBlob: Buffer;
  static keyBlob: Buffer | undefined = undefined;
  token: number = 0x0;
  kcpobj: kcp;

  constructor(public host: string, public port: number) {
    this.server = dgram.createSocket('udp4');
  }

  output = (data: Buffer, size: number, context: any) => {
    // For some reason some data is undefined or null
    if (data == undefined || data == null) return;
    // Some type of detector for stupid packets
    if (data.length > 26) {
      for (const k of this.dataUtil.formatPacket(data, this.token)) {
        // In all the splitted packets
        // send one by one
        this.server.send(k, 0, k.length, context.port, context.address);
      }
      return;
    }
    this.server.send(data, 0, size, context.port, context.address);
  };

  async sendPacket(packet: Packet) {
    // Sends the packet
    const toSend = await this.dataUtil.dataToPacketData(
        packet.data,
        packet.packetID,
        KcpServer.keyBlob || KcpServer.initialKeyBlob,
    );
    packet.kcpobj.send(toSend);
    console.log(
        color('[SENT] %i (%s) was sent back').magenta.toString(),
        packet.packetID,
        packet.protoName,
    );
  }

  async getJson(protoname: string) {
    try {
      return await import(`./json/${protoname}.json`);
    } catch (e) {
      return;
    }
  }

  async convToPacket(
      protoname: string,
      kcpobj: kcp,
      packet: Packet,
      obj: object | undefined = undefined,
  ) {
    const ret = obj || (await this.getJson(protoname));
    const match = protoname.match(/([^\d]+)\d/);
    protoname = match ? match[1] : protoname;
    // Some packets have changed protos since 1.5 so instead of reversing and
    // getting the new protos i will just handle them :troll:
    if (ret == undefined) {
      return new Packet(
          { data: fs.readFileSync(`./src/bin/${protoname}.bin`) },
          protoname,
          kcpobj,
      );
    }

    return await this.dataUtil.objToPacket(
        ret,
        {
          sentMs: packet.metadataProtoBuf.sentMs,
          clientSequenceId: packet.metadataProtoBuf.clientSequenceId,
        },
        protoname,
        kcpobj,
    );
  }

  enterWorldAreaCount: Number = 0;

  async onPacketData(packet: Packet, kcpobj: kcp) {
    try {
      const p = await require('./packets/' + packet.protoName);
      await p.default.execute(packet, kcpobj, this);
    } catch (e) {
      console.log(
          color('UNHANDLED PACKET: %i (%s)').red.toString(),
          packet.packetID,
          packet.protoName,
      );
    }
  }

  async onMessage(data: Buffer, rinfo: dgram.RemoteInfo) {
    const activeClient: string = `${rinfo.address}_${rinfo.port}_${data
        .readUInt32LE(0)
        .toString(16)}`;
    if (data.byteLength <= 20) {
      // console.log(data.toString('hex'))
      switch (data.readUInt32BE(0)) {
        case 0xff:
          const bf = Buffer.from(
              '0000014500000001000000010000000014514545',
              'hex',
          );
          this.server.send(bf, 0, bf.byteLength, rinfo.port, rinfo.address);
          console.log(
              color('[KCP] %s connected').yellow.toString(),
              activeClient,
          );

          const context = {
            address: rinfo.address,
            port: rinfo.port,
          };

          this.kcpobj = new kcp.KCP(1, context);
          this.kcpobj.nodelay(1, 5, 2, 0);
          this.kcpobj.output(this.output);
          this.kcpobj.wndsize(128, 128);

          break;
        case 404:
          console.log(
              color('[KCP] %s disconnected').yellow.toString(),
              activeClient,
          );
          KcpServer.keyBlob = undefined;
          break;
        default:
          console.log(
              color('[KCP] Unhandled Handshake: %i').yellow.toString(),
              data.readUInt32BE(0),
          );
      }
      return;
    }

    this.token = data.readUInt32BE(4);
    if (this.kcpobj == undefined) return;

    const formatedPacket = this.dataUtil.reformatKcpPacket(data);
    this.kcpobj.input(formatedPacket);
  }

  async onError(error: Error) {
    console.log(error);
    this.server.close();
  }

  async onListening() {
    const address = this.server.address();
    console.log(color(`[KCP ${address.port}] LISTENING`).green.toString());

    setInterval(async () => {
      if (this.kcpobj == undefined) {
        return;
      }

      this.kcpobj.update(Date.now());
      const recv = this.kcpobj.recv();
      if (recv) {
        const xorBlob = KcpServer.keyBlob || KcpServer.initialKeyBlob;
        const decryptedData = this.dataUtil.xorData(recv, xorBlob);

        if (this.dataUtil.isValidPacket(decryptedData)) {
          const packet = new Packet(
              this.dataUtil.parsePacketData(decryptedData),
              decryptedData.readUInt16BE(2),
              this.kcpobj,
          );
          if (packet.protoName != undefined) await packet.setProtobuf();
          console.log(
              color('[KCP] Got packet id %i (%s)').green.toString(),
              packet.packetID,
              packet.protoName,
          );
          // console.log(packet.protoBuf)

          //  const jsonRes = await import(`C:/Users/PC/source/repos/pancake-ts/src/json/${packet.protoName}.json`)
          await this.onPacketData(packet, this.kcpobj);
        }
      }
    }, 5);
  }

  start() {
    const db = new sqlite3.Database('./src/util/keys.db', (error) => {
      if (error) {
        throw error; // handling is amazing
      }

      // this is hardcoded too
      db.get('SELECT * FROM keys WHERE first_bytes=51544', async (err, row) => {
        // SQLite Database
        KcpServer.initialKeyBlob = Buffer.from(row.key_buffer);
      });
    });

    this.server.bind(this.port, this.host);

    this.server.on('listening', () => {
      this.onListening();
    });

    this.server.on('message', (d, r) => {
      this.onMessage(d, r);
    });

    this.server.on('error', (e) => {
      this.onError(e);
    });
  }
}
