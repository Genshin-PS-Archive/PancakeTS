// PullRecentChatRsp
import { Packet } from '../util/packet';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import { KcpServer } from '../server';
import Player from '../util/player';

async function execute(packet: Packet, kcpobj: kcp, kcpServer: KcpServer) {
  const plr = Player;
  const PullRecentChatRsp = {
    chatInfo: [
      {
        time: 1634230752,
        uid: 1,
        toUid: plr.uid,
        text: '-CONSOLE-',
      },
    ],
  };

  kcpServer.sendPacket(
      await kcpServer.convToPacket('PullRecentChatRsp', kcpobj, packet, PullRecentChatRsp),
  );
}

export default { execute };
