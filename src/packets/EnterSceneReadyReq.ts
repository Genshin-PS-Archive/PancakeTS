import { Packet } from '../util/packet';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import { KcpServer } from '../server';

async function execute(packet: Packet, kcpobj: kcp, kcpServer: KcpServer) {
  const EnterScenePeerNotify = {
    destSceneId: 3,
    peerId: 1,
    hostPeerId: 1,
    enterSceneToken: 8427,
  };

  kcpServer.sendPacket(
      await kcpServer.convToPacket('EnterScenePeerNotify', kcpobj, packet),
  );

  const EnterSceneReadyRsp = {
    enterSceneToken: 8427,
  };

  kcpServer.sendPacket(
      await kcpServer.convToPacket('EnterSceneReadyRsp', kcpobj, packet),
  );
}

export default { execute };
