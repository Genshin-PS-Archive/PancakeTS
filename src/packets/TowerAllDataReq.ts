// TowerAllDataRsp
import { Packet } from '../util/packet';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import { KcpServer } from '../server';

async function execute(packet: Packet, kcpobj: kcp, kcpServer: KcpServer) {
  // aint handling this
  kcpServer.sendPacket(
      await kcpServer.convToPacket('TowerAllDataRsp', kcpobj, packet),
  );
}

export default { execute };
