import { Packet } from '../util/packet';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import { KcpServer } from '../server';

async function execute(packet: Packet, kcpobj: kcp, kcpServer: KcpServer) {
  const ShopRsp = {
    shop: {
      shopType: 900,
      cardProductList: [
        {
          productId: 'ys_glb_blessofmoon_tier5',
          priceTier: 'Tier_5',
          mcoinBase: 300,
          hcoinPerDay: 90,
          days: 30,
          cardProductType: 1,
        },
      ],
    },
  };


  kcpServer.sendPacket(
      await kcpServer.convToPacket('GetShopRsp', kcpobj, packet),
  );
}

export default { execute };
