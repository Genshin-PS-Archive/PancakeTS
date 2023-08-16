// PostEnterSceneRsp
import { Packet } from '../util/packet';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import { KcpServer } from '../server';

async function execute(packet: Packet, kcpobj: kcp, kcpServer: KcpServer) {
  const PostEnterSceneRsp = {
    enterSceneToken: 8427,
  };


  kcpServer.sendPacket(
      await kcpServer.convToPacket('PostEnterSceneRsp', kcpobj, packet),
  );
}

export default { execute };
