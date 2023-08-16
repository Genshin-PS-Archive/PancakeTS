import { Packet } from '../util/packet';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import { KcpServer } from '../server';

async function execute(packet: Packet, kcpobj: kcp, kcpServer: KcpServer) {
  const GetPlayerFriendListRsp = {
    friendList: [
      {
        uid: 1,
        nickname: 'Console',
        level: 60,
        worldLevel: 5,
        param: 31,
        signature: 'Pancake TS Console',
        isMpModeAvailable: true,
        lastActiveTime: 1630625176,
        nameCardId: 210001,
        profilePicture: {
          avatarId: 10000007,
        },
        isGameSource: true,
        platformType: 'PC',
      },
    ],
  };


  kcpServer.sendPacket(
      await kcpServer.convToPacket('GetPlayerFriendListRsp', kcpobj, packet),
  );
}

export default { execute };
