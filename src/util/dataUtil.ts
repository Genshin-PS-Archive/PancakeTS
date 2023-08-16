import * as protobuf from 'protobufjs';
import { IPacketData, Packet } from './packet';
// @ts-ignore
import kcp from 'node-kcp';
import pIds from './packetIds.json';
const packetIds = pIds as { [packetIds: string]: string };

const switchedPacketIds = (function() {
  const obj: { [key: string]: any } = {};

  Object.keys(packetIds).forEach((key) => {
    obj[packetIds[key]] = key;
  });

  return obj;
})();

/**
 * @example
 * PACKET INFO
 * Example:
 * 45670005000c0000000b18f7032801309df197eea02f10cbc4a086062566c889Ab
 *
 * 4567 - Magic Bytes
 * 0005 - Packet ID
 * 000c - Metadata Length
 * 0000000b - Packet Data Length
 * 18f7032801309df197eea02f10cbc4a086062566c8 - Packet Data
 * 89AB - Magic Bytes
 */

export class DataUtil {
  /**

   * @param data packet
   * @param key blob key
   * @return {Buffer} buffer with xored data
   */
  xorData(data: Buffer, key: Buffer) {
    const ret: Buffer = Buffer.from(data);

    for (let i = 0; i < data.length; i++) {
      ret.writeUInt8(data.readUInt8(i) ^ key.readUInt8(i % key.length), i);
    }

    return ret;
  }

  /**
   * 45 67 00 05 00 0c 00 00 00 0b 18f7032801309df197eea02f10cbc4a086062566c889Ab
   * @param data Buffer with data
   * @return packet data
   * Example:
   * 45670066000000000028080c1224e799bbe99986e9aa8ce8af81e99499e8afafefbc8ce8afb7e9878de696b0e799bbe5bd9589ab
   * would now be:
   * 080c1224e799bbe99986e9aa8ce8af81e99499e8afafefbc8ce8afb7e9878de696b0e799bbe5bd95
   */
  parsePacketData(data: Buffer) {
    const sliced = Buffer.from(data.slice(10)).slice(0, -2);
    return {
      data: sliced.slice(data.readUInt8(5)),
      metadata: sliced.slice(0, data.readUInt8(5)),
    };
  }

  /**
   *
   * @param packetID Packet ID
   * @return {string} Protobuf name
   */
  getProtoNameByPacketID(packetID: string) {
    return packetIds[packetID];
  }

  /**
   *
   * @param protoName Protobuffer name
   * @return Packet ID
   */
  getPacketIDByProtoName(protoName: string) {
    return switchedPacketIds[protoName];
  }

  /**
   *
   * @param obj Object to convert to protobuf
   * @param packetID Packet ID to use
   * @return Protobuf Buffer
   */
  async objToProtobuf(obj: object, packetID: string | number) {
    try {
      const protoName: string =
        typeof packetID == 'number' ?
          this.getProtoNameByPacketID(packetID.toString()) :
          packetID;

      const root = await protobuf.load(`src/proto/${protoName}.proto`);

      return root.lookupTypeOrEnum(protoName).fromObject(obj);
    } catch (e) {
      console.log(e);
      return;
    }
  }

  /**
   *
   * @param obj Object to convert to protobuf
   * @param packetID Packet ID to use
   * @return Protobuf Buffer
   */
  async objToProtoBuffer(
      obj: object,
      packetID: string | number,
      customName: string | undefined = undefined,
  ) {
    try {
      const protoName: string =
        customName || typeof packetID == 'number' ?
          this.getProtoNameByPacketID(packetID.toString()) :
          packetID;

      const root = await protobuf.load(`src/proto/${protoName}.proto`);

      const testMessage = root.lookupType(protoName);
      const message = testMessage.fromObject(obj);
      return testMessage.encode(message).finish();
    } catch (e) {
      console.log(e);
      return;
    }
  }

  /**
   *
   * @param data Packet Data
   * @param packetID Packet ID
   * @return Protobuf Object
   */
  async dataToProtobuf(
      data: Buffer,
      packetID: string,
      customName: string | undefined = undefined,
  ) {
    try {
      const protoName = customName || this.getProtoNameByPacketID(packetID);

      const root = await protobuf.load(`src/proto/${protoName}.proto`);

      const testMessage = root.lookupType(protoName);
      return testMessage.decode(data);
    } catch (e) {
      console.log(
          'Error parsing packet %s : Error: %s',
          this.getProtoNameByPacketID(packetID),
          e,
      );
      return;
    }
  }

  /**
   *
   * @param obj Object to convert to protobuf object
   * @param packetID Packet ID
   * @return Protobuf Object
   */
  async protobufToObj(obj: object, packetID: string) {
    try {
      const protoName = this.getProtoNameByPacketID(packetID);

      const root = await protobuf.load(`./proto/${protoName}.proto`);
      const testMessage = root.lookupType(protoName);
      return testMessage.toObject(testMessage.create(obj));
    } catch (e) {
      console.log(e);
      return;
    }
  }

  /**
   * Adds the Convo thing to the UDP packet
   * @param message Packet Data
   * @return Buffer with the fixed data
   */
  reformatKcpPacket(message: Buffer) {
    let i = 0;
    let tokenSizeTotal = 0;
    const messages = [];
    while (i < message.length) {
      const convId = message.readUInt32BE(i);
      const remainingHeader = message.subarray(i + 8, i + 28);
      const contentLen = message.readUInt32LE(i + 24);
      const content = message.subarray(i + 28, i + 28 + contentLen);

      const formattedMessage = Buffer.alloc(24 + contentLen);
      formattedMessage.writeUInt32BE(convId, 0);
      remainingHeader.copy(formattedMessage, 4);
      content.copy(formattedMessage, 24);
      i += 28 + contentLen;
      tokenSizeTotal += 4;
      messages.push(formattedMessage);
    }
    return Buffer.concat(messages, message.length - tokenSizeTotal);
  }

  /**
   * Converts the data buffer to a packet data
   * @param data
   * @param packetID
   * @param keyBuffer
   * @returns
   */
  async dataToPacketData(data: IPacketData, packetID: number, keyBuffer: Buffer) {
    const magic2 = Buffer.from('89AB', 'hex');
    const part1 = Buffer.alloc(10);

    part1.writeUInt16BE(0x4567, 0);
    part1.writeUInt16BE(packetID, 2);
    part1.writeUInt8(data.metadata!.length, 5);
    part1.writeUInt16BE(data.data.length, 8);

    const ret = Buffer.concat(
        [part1, data.metadata!, data.data, magic2],
        part1.length + data.metadata!.length + data.data.length + magic2.length,
    );

    return this.xorData(ret, keyBuffer);
  }

  /**
   * Converts the packet data to a packet
   * @param data Packet
   * @param token Packet Token
   * @returns
   */
  formatPacket(data: Buffer, token: number) {
    let i = 0;
    const msgs = [];
    while (i < data.length) {
      const conv = data.readUInt32BE(i);
      const contentLen = data.readUInt32LE(i + 20);
      const newStart = Buffer.alloc(8);
      newStart.writeUInt32BE(conv, 0);
      newStart.writeUInt32BE(token, 4);

      const slice = data.subarray(i + 4, i + 24 + contentLen);
      const concat = Buffer.concat([newStart, slice]);
      msgs.push(concat);
      i += contentLen + 24;
    }
    return msgs;
  }

  isValidPacket(data: Buffer) {
    return (
      data.length > 5 &&
      data.readInt16BE(0) == 0x4567 &&
      data.readUInt16BE(data.byteLength - 2) == 0x89ab
    );
  }

  async objToPacket(
      dataObj: Object,
      metadataObj: Object,
      protoName: string,
      kcpobj: kcp,
  ) {
    return new Packet(
        {
          data: (await this.objToProtoBuffer(dataObj, protoName)) as Buffer,
          metadata: (await this.objToProtoBuffer(
              metadataObj,
              13371337,
          )) as Buffer,
        },
        protoName,
        kcpobj,
    );
  }
}
