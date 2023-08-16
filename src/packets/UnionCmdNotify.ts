// QueryPathRsp
import { Packet } from '../util/packet';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import { KcpServer } from '../server';
import Player from '../util/player';

async function execute(packet: Packet, kcpobj: kcp, kcpServer: KcpServer) {
  const acket = new Packet(
      {data: packet.protoBuf.cmdList[0].body},
      packet.protoBuf.cmdList[0].messageId,
      kcpobj,
  );

  if (acket.protoName != undefined) {
    await acket.setProtobuf();
  }

  const plr = Player;

  if (packet.protoBuf.cmdList[0].messageId == 359) {
    const combatData = new Packet(
        {data: acket.protoBuf.invokeList[0].combatData},
        'EntityMoveInfo',
        kcpobj,
        true,
    );
    if (combatData.protoName != undefined) {
      await combatData.setProtobuf('EntityMoveInfo');
    }
    plr.entityId = combatData.protoBuf.entityId;
    plr.motionInfo = combatData.protoBuf.motionInfo;
  }
}


export default { execute };
