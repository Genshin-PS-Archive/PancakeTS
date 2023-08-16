// GetAllActivatedBargainDataRsp
import { Packet } from '../util/packet';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import { KcpServer } from '../server';

async function execute(packet: Packet, kcpobj: kcp, kcpServer: KcpServer) {
  const GetSceneAreaRsp = {
    sceneId: 3,
    areaIdList: [2, 13, 12, 1, 9, 10, 5, 16, 11, 4, 8, 18, 7, 14, 3, 6, 17],
    cityInfoList: [
      {
        cityId: 3,
        level: 8,
        crystalNum: 1,
      },
      {
        cityId: 1,
        level: 10,
      },
      {
        cityId: 2,
        level: 10,
      },
    ],
  };

  kcpServer.sendPacket(
      await kcpServer.convToPacket('GetSceneAreaRsp', kcpobj, packet),
  );
}

export default { execute };

