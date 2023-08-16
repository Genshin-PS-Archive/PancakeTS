// GetAllActivatedBargainDataRsp
import { Packet } from '../util/packet';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import { KcpServer } from '../server';

async function execute(packet: Packet, kcpobj: kcp, kcpServer: KcpServer) {
  kcpServer.sendPacket(
      await kcpServer.convToPacket('GetAllActivatedBargainDataRsp', kcpobj, packet),
  );
}

export default { execute };
