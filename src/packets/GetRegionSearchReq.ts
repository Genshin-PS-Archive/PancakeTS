// GetRegionSearchRsp
import { Packet } from '../util/packet';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import { KcpServer } from '../server';
import Player from '../util/player';

async function execute(packet: Packet, kcpobj: kcp, kcpServer: KcpServer) {
  const plr = Player;
  kcpServer.sendPacket(
      await kcpServer.convToPacket('RegionSearchNotify', kcpobj, packet, {
        'uid': plr.uid,
      }),
  );
}

export default { execute };
