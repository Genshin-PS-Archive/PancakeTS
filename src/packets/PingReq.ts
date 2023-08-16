import { Packet } from '../util/packet';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import { KcpServer } from '../server';

async function execute(packet: Packet, kcpobj: kcp, kcpServer: KcpServer) {
  const PingRsp = {
    clientTime: packet.protoBuf.clientTime,
    seq: packet.protoBuf.seq,
  };
  console.log(packet.metadataProtoBuf);
  kcpServer.sendPacket(
      await kcpServer.convToPacket('PingRsp', kcpobj, packet, PingRsp),
  );
}

export default { execute };
