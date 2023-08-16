import { Packet } from '../util/packet';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import { KcpServer } from '../server';

async function execute(packet: Packet, kcpobj: kcp, kcpServer: KcpServer) {
  const GetActivityInfoRsp = {
    activityIdList: [
      5048,
      5002,
    ],
  };

  kcpServer.sendPacket(
      await kcpServer.convToPacket('GetActivityInfoRsp', kcpobj, packet),
  );
}

export default { execute };
