import { Packet } from '../util/packet';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import { KcpServer } from '../server';
import Player from '../util/player';

const plr = Player;

async function execute(packet: Packet, kcpobj: kcp, kcpServer: KcpServer) {
  // ActivityScheduleInfoNotify
  kcpServer.sendPacket(
      await kcpServer.convToPacket('ActivityScheduleInfoNotify', kcpobj, packet),
  );

  // PlayerPropNotify
  kcpServer.sendPacket(
      await kcpServer.convToPacket('PlayerPropNotify', kcpobj, packet),
  );

  // PlayerDataNotify
  kcpServer.sendPacket(
      await kcpServer.convToPacket('PlayerDataNotify', kcpobj, packet),
  );

  // OpenStateUpdateNotify
  kcpServer.sendPacket(
      await kcpServer.convToPacket('OpenStateUpdateNotify', kcpobj, packet),
  );

  // StoreWeightLimitNotify
  kcpServer.sendPacket(
      await kcpServer.convToPacket('StoreWeightLimitNotify', kcpobj, packet),
  );

  // PlayerStoreNotify
  kcpServer.sendPacket(
      await kcpServer.convToPacket('PlayerStoreNotify', kcpobj, packet),
  );

  // AvatarDataNotify
  kcpServer.sendPacket(
      await kcpServer.convToPacket('AvatarDataNotify', kcpobj, packet),
  );

  // AvatarSatiationDataNotify
  kcpServer.sendPacket(
      await kcpServer.convToPacket('AvatarSatiationDataNotify', kcpobj, packet),
  );

  // RegionSearchNotify
  kcpServer.sendPacket(
      await kcpServer.convToPacket('RegionSearchNotify', kcpobj, packet, {
        uid: plr.uid,
      }),
  );

  // PlayerEnterSceneNotify
  const PlayerEnterSceneNotify = {
    sceneId: 3,
    pos: plr.motionInfo.pos,
    sceneBeginTime: '1634238866027',
    type: 'ENTER_SELF',
    targetUid: plr.uid,
    worldLevel: 8,
    enterSceneToken: 8427,
    isFirstLoginEnterScene: false,
    sceneTagIdList: [
      111,
      112,
      116,
      118,
      125,
    ],
    enterReason: 1,
    worldType: 1,
    // Seems to be sceneId-uid-sceneBeginTime-???
    sceneTransaction: '3-' + plr.uid + '-1634238866-5602',
  };

  kcpServer.sendPacket(
      await kcpServer.convToPacket('PlayerEnterSceneNotify', kcpobj, packet, PlayerEnterSceneNotify),
  );

  const PlayerLoginRsp = {
    isUseAbilityHash: true,
    abilityHashCode: -597199551,
    clientDataVersion: 4715326,
    clientSilenceDataVersion: 4715326,
    gameBiz: 'hk4e_global',
    clientDataMd5: '{"remoteName": "data_versions", "md5": "29199ab2d79f559230cf2d2060816cd0", "fileSize": 4402}',
    clientSilenceDataMd5: '{"remoteName": "data_versions", "md5": "3bfc9b25c82a292f6d0299d7ee9d9522", "fileSize": 515}',
    resVersionConfig: {
      version: 4705718,
      md5: '{"remoteName": "res_versions_external", "md5": "65d6393e0de3b456b54040b0b15c2400", "fileSize": 440193}\r\n' +
          '{"remoteName": "res_versions_medium", "md5": "64f2649562e90261012b17be824be671", "fileSize": 231631}\r\n' +
          '{"remoteName": "release_res_versions_external", "md5": "8b855b829cb6d8d00ed1fd46c617c4dc", "fileSize": 440193}\r\n' +
          '{"remoteName": "release_res_versions_medium", "md5": "4f32fb3b92cdbba6c3dbf74f24cdf022", "fileSize": 231631}\r\n' +
          '{"remoteName": "base_revision", "md5": "cbd0c325e3d247b820cda00d9616471c", "fileSize": 18}',
      releaseTotalSize: '0',
      versionSuffix: '1a1da51473',
      branch: '2.5.50_live',
    },
    clientVersionSuffix: '9bc8c73a4b',
    clientSilenceVersionSuffix: '9bc8c73a4b',
    scInfo: 'zxAB/CgAAAAWKwBKzP3/C9+/a+SHZqc3Dnb5zEW0MF5iy65iQpbd/w==',
    isScOpen: true,
    registerCps: 'mihoyo',
    countryCode: 'CN',
    totalTickTime: 6817.290782884229,
  };
  // PlayerLoginRsp
  kcpServer.sendPacket(await kcpServer.convToPacket(
      'PlayerLoginRsp',
      kcpobj, packet,
      PlayerLoginRsp,
  ));
}

export default { execute };
