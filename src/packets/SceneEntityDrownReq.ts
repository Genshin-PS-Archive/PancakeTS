// ChangeAvatarRsp
import { Packet } from '../util/packet';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import { KcpServer } from '../server';

async function execute(packet: Packet, kcpobj: kcp, kcpServer: KcpServer) {
  const SceneEntityDisappearNotify = {
    entityList: [
      packet.protoBuf.entityId,
    ],
    disappearType: 6,
  };

  kcpServer.sendPacket(
      await kcpServer.convToPacket('SceneEntityDisappearNotify', kcpobj, packet, SceneEntityDisappearNotify),
  );

  const SceneEntityDrownRsp = {
    retcode: 0,
    entityId: packet.protoBuf.entityId,
  };

  kcpServer.sendPacket(
      await kcpServer.convToPacket('SceneEntityDrownRsp', kcpobj, packet, SceneEntityDrownRsp),
  );
}

export default { execute };
