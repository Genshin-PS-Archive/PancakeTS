// DoGachaRsp
import { Packet } from '../util/packet';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import { KcpServer } from '../server';

async function execute(packet: Packet, kcpobj: kcp, kcpServer: KcpServer) {
  const DoGachaRsp = {
    'gachaType': 301,
    'gachaTimes': 1,
    'gachaScheduleId': 587,
    'gachaItemList': [
      {
        'gachaItem_': {
          'itemId': 13303,
          'count': 1,
        },
        'tokenItemList': [
          {
            'itemId': 222,
            'count': 15,
          },
        ],
      },
    ],
    'newGachaRandom': 1245329956,
    'costItemId': 223,
    'costItemNum': 1,
    'tenCostItemId': 223,
    'tenCostItemNum': 0,
    'leftGachaTimes': 4294967295,
    'gachaTimesLimit': 4294967295,
  };

  kcpServer.sendPacket(
      await kcpServer.convToPacket('DoGachaRsp', kcpobj, packet, DoGachaRsp),
  );
}

export default { execute };
