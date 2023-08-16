import { Packet } from '../util/packet';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import { KcpServer } from '../server';

async function execute(packet: Packet, kcpobj: kcp, kcpServer: KcpServer) {
  const GetShopmallDataRsp = {
    'shopTypeList': [
      900,
      1052,
      902,
      1001,
      903,
    ],
  };

  kcpServer.sendPacket(
      await kcpServer.convToPacket('GetShopmallDataRsp', kcpobj, packet, GetShopmallDataRsp),
  );
}

export default { execute };
