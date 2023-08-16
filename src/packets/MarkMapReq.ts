// QueryPathRsp
import { Packet } from '../util/packet';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import { KcpServer } from '../server';
import Player from '../util/player';

async function execute(packet: Packet, kcpobj: kcp, kcpServer: KcpServer) {
  const plr = Player;
  if (packet.protoBuf.mark) {
    try {
      const p = {
        entityList: [
          {
            entityType: 'PROT_ENTITY_AVATAR',
            entityId: plr.entityId,
            motionInfo: {
              pos: {
                X: 1705.0152587890625,
                Y: 210.002685546875,
                Z: -2646.8212890625,
              },
              rot: {
                Y: 38.38740158081055,
              },
              speed: {},
            },
            propList: [
              {
                type: 4001,
                propValue: {
                  type: 4001,
                  ival: '90',
                  val: '90',
                },
              },
            ],
            fightPropList: [
              {
                propType: 1,
                propValue: 111243.2080078125,
              },
              {
                propType: 2,
                propValue: 15945.1396484375,
              },
              {
                propType: 3,
                propValue: 12.0653371810913086,
              },
              {
                propType: 4,
                propValue: 1506.591064453125,
              },
              {
                propType: 5,
                propValue: 1349.1300048828125,
              },
              {
                propType: 6,
                propValue: 1,
              },
              {
                propType: 7,
                propValue: 1564.4993896484375,
              },
              {
                propType: 8,
                propValue: 100.6300048828125,
              },
              {
                propType: 9,
                propValue: 10.10490000247955322,
              },
              {
                propType: 20,
                propValue: 10.2289000004529953,
              },
              {
                propType: 21,
              },
              {
                propType: 22,
                propValue: 10.9429000020027161,
              },
              {
                propType: 23,
                propValue: 1.152899980545044,
              },
              {
                propType: 26,
              },
              {
                propType: 27,
              },
              {
                propType: 28,
              },
              {
                propType: 29,
              },
              {
                propType: 30,
              },
              {
                propType: 40,
              },
              {
                propType: 41,
              },
              {
                propType: 42,
              },
              {
                propType: 43,
              },
              {
                propType: 44,
              },
              {
                propType: 45,
                propValue: 1000.14399999380111694,
              },
              {
                propType: 46,
              },
              {
                propType: 50,
              },
              {
                propType: 51,
              },
              {
                propType: 52,
              },
              {
                propType: 53,
              },
              {
                propType: 54,
              },
              {
                propType: 55,
              },
              {
                propType: 56,
              },
              {
                propType: 76,
                propValue: 140,
              },
              {
                propType: 2000,
                propValue: 40409.36328125,
              },
              {
                propType: 2001,
                propValue: 1000.4034423828125,
              },
              {
                propType: 2002,
                propValue: 1000.3453979492188,
              },
              {
                propType: 2003,
              },
              {
                propType: 1010,
                propValue: 40409.36328125,
              },
            ],
            lifeState: 1,
            animatorParaList: [
              {},
            ],
            avatar: {
              uid: 1337,
              avatarId: 10000032,
              guid: '2664326143951252776',
              peerId: 1,
              equipIdList: [
                88543,
                91523,
                91553,
                91513,
                91433,
                13303,
              ],
              skillDepotId: 3001,
              weapon: {
                entityId: 100663509,
                gadgetId: 50013303,
                itemId: 13303,
                guid: '2664326143951244698',
                level: 80,
                promoteLevel: 5,
                abilityInfo: {},
                affixMap: {
                  113303: 4,
                },
              },
              reliquaryList: [
                {
                  itemId: 88543,
                  guid: '2664326143951336725',
                  level: 21,
                },
                {
                  itemId: 91523,
                  guid: '2664326143951481191',
                  level: 21,
                },
                {
                  itemId: 91553,
                  guid: '2664326143951577623',
                  level: 21,
                },
                {
                  itemId: 91513,
                  guid: '2664326143951545289',
                  level: 21,
                },
                {
                  itemId: 91433,
                  guid: '2664326143951599549',
                  level: 17,
                },
              ],
              inherentProudSkillList: [
                302101,
                302201,
                302301,
              ],
              skillLevelMap: {
                10301: 2,
                10302: 6,
                10303: 6,
              },
              proudSkillExtraLevelMap: {
                3031: 1,
              },
              teamResonanceList: [
                10801,
              ],
              wearingFlycloakId: 140005,
              bornTime: 1620699348,
              excelInfo: {
                prefabPathHash: '613941571388',
                prefabPathRemoteHash: '1009270878742',
                controllerPathHash: '651151760882',
                controllerPathRemoteHash: '1019573886117',
                combatConfigHash: '633834988714',
              },
            },
            entityClientData: {},
            entityAuthorityInfo: {
              abilityInfo: {},
              rendererChangedInfo: {},
              aiInfo: {
                isAiOpen: true,
                bornPos: {},
              },
              bornPos: {},
            },
          },
        ],
        appearType: 'VISION_REBORN',
      };

      p.entityList[0].entityId = plr.entityId;

      p.entityList[0].motionInfo.pos.X = packet.protoBuf.mark.pos.X;
      p.entityList[0].motionInfo.pos.Y = 200;
      p.entityList[0].motionInfo.pos.Z = packet.protoBuf.mark.pos.Z;

      kcpServer.sendPacket(
          await kcpServer.convToPacket('SceneEntityAppearNotify', kcpobj, packet, p),
      );
    } catch (e) {
      console.log(e);
    }
  }
}

export default { execute };
