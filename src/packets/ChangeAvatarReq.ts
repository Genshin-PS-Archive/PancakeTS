// ChangeAvatarRsp
import { Packet } from '../util/packet';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import { KcpServer } from '../server';
import Player from '../util/player';

import SceneEntityAppearNotify from '../json/SceneEntityAppearNotify.json';
import PlayerEnterSceneInfoNotify from '../json/PlayerEnterSceneInfoNotify.json';
import SceneTeamUpdateNotify from '../json/SceneTeamUpdateNotify.json';

async function execute(packet: Packet, kcpobj: kcp, kcpServer: KcpServer) {
  const plr = Player;

  // Dissapears Current Entity
  const SceneEntityDisappearNotify = {
    entityList: [plr.entityId],
    disappearType: 'VISION_REPLACE',
  };

  kcpServer.sendPacket(
      await kcpServer.convToPacket('SceneEntityDisappearNotify', kcpobj, packet, SceneEntityDisappearNotify),
  );

  const p = SceneEntityAppearNotify;
  p.entityList[0].entityId = plr.entityId;
  p.entityList[0].motionInfo.pos = plr.motionInfo.pos;
  p.appearType = 'VISION_REPLACE'; // VISION_REPLACE

  const sceneInfo = PlayerEnterSceneInfoNotify;
  console.log(packet.protoBuf.guid);
  // Sets the current avatarEntityId to the one in the REQ
  for (const avatar of sceneInfo.avatarEnterInfo) {
    if (avatar.avatarGuid == packet.protoBuf.guid) {
      sceneInfo.curAvatarEntityId = avatar.avatarEntityId;
    }
  }

  plr.entityId = sceneInfo.curAvatarEntityId;

  const avatarDataNotify = SceneTeamUpdateNotify;

  // All the EntityIds in SceneEntityAppearNotify
  for (const e of p.entityList) {
    // EntityID is now current AvatarId
    e.entityId = sceneInfo.curAvatarEntityId;
    e.avatar.guid = packet.protoBuf.guid.toString();
    // Checks in every sceneTeamAvatarList which guid is the changed chatacter one and changes its position to the current user one
    for (const avatar of avatarDataNotify.sceneTeamAvatarList) {
      if (avatar.avatarGuid.toString() == packet.protoBuf.guid.toString()) {
        avatar.sceneEntityInfo.motionInfo = e.motionInfo;
      }
    }
  }

  kcpServer.sendPacket(
      await kcpServer.convToPacket('SceneEntityAppearNotify', kcpobj, packet, p),
  );
  console.log(JSON.stringify(p, null, 4));
  const ChangeAvatarRsp = {
    curGuid: packet.protoBuf.guid,
    retcode: 0,
  };

  kcpServer.sendPacket(
      await kcpServer.convToPacket('ChangeAvatarRsp', kcpobj, packet, ChangeAvatarRsp),
  );
}

export default { execute };
