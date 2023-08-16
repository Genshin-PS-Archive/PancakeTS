// QueryPathRsp
import { Packet } from '../util/packet';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import { KcpServer } from '../server';
import Player from '../util/player';

async function execute(packet: Packet, kcpobj: kcp, kcpServer: KcpServer) {
  const plr = Player;
  const PrivateChatRsp = {
    retcode: 0,
    chatForbiddenEndtime: Date.now(),
  };

  kcpServer.sendPacket(
      await kcpServer.convToPacket('PrivateChatRsp', kcpobj, packet, PrivateChatRsp),
  );

  const PrivateChatNotify = {
    chatInfo: {
      uid: 1337,
      toUid: packet.protoBuf.targetUid,
      text: packet.protoBuf.text,
      isRead: false,
    },
  };

  kcpServer.sendPacket(
      await kcpServer.convToPacket('PrivateChatNotify', kcpobj, packet, PrivateChatNotify),
  );

  const toBuff = Buffer.from(packet.protoBuf.text);
  const command = toBuff.toString().split(' ')[0];
  const args = toBuff.toString().trim().split(' ');
  let reply = 'PLACEHOLDER';

  switch (command) {
    case 'r':
    case 'reload':
      try {
        delete require.cache[require.resolve(`./${args[1]}.ts`)];
      } catch (e) {
        console.log(e);
      }

      reply = `${args[1]} was reloaded.`;
      break;

    case 's':
    case 'spawn':
      const s = await kcpServer.getJson('SceneEntityAppearNotify5');
      s.entityList[0].monster.monsterId = args[1];
      s.entityList[0].entityId = args[1];
      s.entityList[0].motionInfo = plr.motionInfo;

      kcpServer.sendPacket(
          await kcpServer.convToPacket('SceneEntityAppearNotify', kcpobj, packet, s),
      );
      reply = `Entity ${args[1]} spawned`;
      break;
    case 'se':
    case 'send':
      kcpServer.sendPacket(await kcpServer.convToPacket(args[1], kcpobj, packet));
      reply = `${args[1]} was sent back`;
      break;
    case 't':
    case 'time':
      const time = {
        gameTime: args[1],
        uid: plr.uid,
      };
      kcpServer.sendPacket(
          await kcpServer.convToPacket('PlayerGameTimeNotify', kcpobj, packet, time),
      );
      reply = `Time was changed to ${args[1]}`;
      break;
    case 'ed':
      const entity = {
        entityList: [args[1]],
        disappearType: 'VISION_DIE',
      };
      kcpServer.sendPacket(
          await kcpServer.convToPacket('SceneEntityDisappearNotify', kcpobj, packet, entity),
      );
      reply = `Entity ${args[1]} was killed brutally`;
    case 'prop':
      const prop: { [key: string]: any } = { propMap: {} };
      prop.propMap[args[1]] = {
        'type': parseInt(args[1]),
        'ival': {
          'low': args[2],
          'high': args[2],
          'unsigned': false,
        },
      };
      console.log(prop);
      kcpServer.sendPacket(
          await kcpServer.convToPacket('PlayerPropNotify', kcpobj, packet, prop),
      );
      reply = `PropMap with id ${args[1]} was sent`;
      break;
    default:
      reply = 'Command not found';
  }

  const ConsoleResponse = {
    chatInfo: {
      uid: 1,
      toUid: 1337,
      text: reply,
      isRead: false,
    },
  };

  kcpServer.sendPacket(
      await kcpServer.convToPacket('PrivateChatNotify', kcpobj, packet, ConsoleResponse),
  );
}

export default { execute };
