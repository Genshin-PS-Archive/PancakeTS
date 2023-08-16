import { Packet } from '../util/packet';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import { KcpServer } from '../server';
import Player from '../util/player';

async function execute(packet: Packet, kcpobj: kcp, kcpServer: KcpServer) {
  const plr = Player;
  try {
    kcpServer.sendPacket(
        await kcpServer.convToPacket('WorldDataNotify', kcpobj, packet),
    );

    kcpServer.sendPacket(
        await kcpServer.convToPacket('WorldOwnerDailyTaskNotify', kcpobj, packet),
    );


    // TeamResonanceChangeNotify
    kcpServer.sendPacket(
        await kcpServer.convToPacket('TeamResonanceChangeNotify', kcpobj, packet),
    );

    // WorldAllRoutineTypeNotify
    kcpServer.sendPacket(
        await kcpServer.convToPacket('WorldAllRoutineTypeNotify', kcpobj, packet),
    );

    // PlayerGameTimeNotify
    kcpServer.sendPacket(
        await kcpServer.convToPacket('PlayerGameTimeNotify', kcpobj, packet, {
          'gameTime': 12332,
          'uid': plr.uid,
        }),
    );

    // SceneTimeNotify
    kcpServer.sendPacket(
        await kcpServer.convToPacket('SceneTimeNotify', kcpobj, packet),
    );

    // SceneDataNotify
    kcpServer.sendPacket(
        await kcpServer.convToPacket('SceneDataNotify', kcpobj, packet),
    );

    // AvatarEquipChangeNotify
    kcpServer.sendPacket(
        await kcpServer.convToPacket('AvatarEquipChangeNotify', kcpobj, packet),
    );

    // AvatarEquipChangeNotify1
    kcpServer.sendPacket(
        await kcpServer.convToPacket('AvatarEquipChangeNotify1', kcpobj, packet),
    );

    // AvatarEquipChangeNotify2
    kcpServer.sendPacket(
        await kcpServer.convToPacket('AvatarEquipChangeNotify2', kcpobj, packet),
    );

    // AvatarEquipChangeNotify3
    kcpServer.sendPacket(
        await kcpServer.convToPacket('AvatarEquipChangeNotify3', kcpobj, packet),
    );

    // HostPlayerNotify
    kcpServer.sendPacket(
        await kcpServer.convToPacket('HostPlayerNotify', kcpobj, packet, {
          'hostUid': plr.uid,
          'hostPeerId': 1,
        }),
    );

    // ScenePlayerInfoNotify
    const playerInfo = {
      'playerInfoList': [
        {
          'uid': plr.uid,
          'peerId': 1,
          'name': plr.name,
          'sceneId': 3,
          'onlinePlayerInfo': {
            'uid': plr.uid,
            'nickname': plr.name,
            'playerLevel': 56,
            'mpSettingType': 'MP_SETTING_ENTER_AFTER_APPLY',
            'curPlayerNumInWorld': 1,
            'worldLevel': 8,
            'nameCardId': 210046,
            'signature': plr.signature,
            'profilePicture': {
              'avatarId': 10000052,
            },
          },
        },
      ],
    };
    kcpServer.sendPacket(
        await kcpServer.convToPacket('ScenePlayerInfoNotify', kcpobj, packet, playerInfo),
    );

    // PlayerEnterSceneNotify
    const PlayerEnterSceneNotify = {
      'sceneId': 3,
      'pos': plr.motionInfo.pos || {
        'X': 1705.0152587890625,
        'Y': 210.002685546875,
        'Z': -2646.8212890625},
      'sceneBeginTime': '1634238866027',
      'type': 'ENTER_SELF',
      'targetUid': plr.uid,
      'worldLevel': 8,
      'enterSceneToken': 8427,
      'isFirstLoginEnterScene': false,
      'sceneTagIdList': [
        111,
        112,
        116,
        118,
        125,
      ],
      'enterReason': 1,
      'worldType': 1,
      // Seems to be sceneId-uid-sceneBeginTime-???
      'sceneTransaction': '3-' + plr.uid + '-1634238866-5602',
    };

    kcpServer.sendPacket(
        await kcpServer.convToPacket('PlayerEnterSceneNotify', kcpobj, packet, PlayerEnterSceneNotify),
    );

    // PlayerEnterSceneInfoNotify
    kcpServer.sendPacket(
        await kcpServer.convToPacket('PlayerEnterSceneInfoNotify', kcpobj, packet),
    );

    // SyncTeamEntityNotify
    kcpServer.sendPacket(
        await kcpServer.convToPacket('SyncTeamEntityNotify', kcpobj, packet),
    );

    // SyncScenePlayTeamEntityNotify
    kcpServer.sendPacket(
        await kcpServer.convToPacket('SyncScenePlayTeamEntityNotify', kcpobj, packet),
    );

    // ScenePlayBattleInfoListNotify
    kcpServer.sendPacket(
        await kcpServer.convToPacket('ScenePlayBattleInfoListNotify', kcpobj, packet),
    );

    // SceneTeamUpdateNotify
    kcpServer.sendPacket(
        await kcpServer.convToPacket('SceneTeamUpdateNotify', kcpobj, packet),
    );

    // PlayerPropNotify1
    kcpServer.sendPacket(
        await kcpServer.convToPacket('PlayerPropNotify1', kcpobj, packet),
    );

    // SceneInitFinishRsp
    kcpServer.sendPacket(
        await kcpServer.convToPacket('SceneInitFinishRsp', kcpobj, packet),
    );
  } catch (e) {
    console.log(e);
  }
}

export default { execute };
