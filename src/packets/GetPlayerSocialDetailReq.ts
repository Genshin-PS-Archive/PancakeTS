import { Packet } from '../util/packet';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import { KcpServer } from '../server';
import Player from '../util/player';

async function execute(packet: Packet, kcpobj: kcp, kcpServer: KcpServer) {
  const plr = Player;
  const GetPlayerSocialDetailRsp = {
    detailData: {
      uid: plr.uid,
      nickname: plr.name,
      level: 60,
      signature: plr.signature,
      birthday: {
        month: 2,
        day: 8,
      },
      worldLevel: 8,
      onlineState: 'FRIEND_ONLINE',
      isFriend: true,
      isMpModeAvailable: true,
      nameCardId: 210046,
      finishAchievementNum: 374,
      towerFloorIndex: 11,
      towerLevelIndex: 3,
      isShowAvatar: true,
      profilePicture: {
        avatarId: 10000052,
      },
    },
  };


  kcpServer.sendPacket(
      await kcpServer.convToPacket('GetPlayerSocialDetailRsp', kcpobj, packet, GetPlayerSocialDetailRsp),
  );
}

export default { execute };
