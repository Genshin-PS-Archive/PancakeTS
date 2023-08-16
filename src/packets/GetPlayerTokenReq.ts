import { execFile } from 'child_process';
import { Packet } from '../util/packet';
// @ts-ignore
import kcp from '../node-kcp/kcp';
import { KcpServer } from '../server';
import Player from '../util/player';

async function execute(packet: Packet, kcpobj: kcp, kcpServer: KcpServer) {
  console.log(Player);
  const plr = Player;
  const GetPlayerTokenRsp = {
    uid: plr.uid,
    token: '1',
    accountType: 1,
    accountUid: '109058282',
    isProficientPlayer: true,
    secretKeySeed: '2',
    securityCmdBuffer: '6UveeAn/YYPMy/aoHclHwH8OKpkm1/kAFxyXQ+hSiqw=',
    platformType: 3,
    channelId: 1,
    countryCode: 'CN',
    clientVersionRandomKey: '202-0b393bc59ff7',
    regPlatform: 3,
    clientIpStr: '0.0.0.0',
  };

  // GetPlayerTokenRsp
  kcpServer.sendPacket(
      await kcpServer.convToPacket('GetPlayerTokenRsp', kcpobj, packet, GetPlayerTokenRsp),
  );

  // Executes C# compiled EXE that returns the XOR Blob determined by secretKeySeed
  execFile(
      './src/secretKey/ConsoleApp2.exe',
      ['2'],
      function(err, stdout, stderr) {
        if (err) {
          console.log(err);
        }
        KcpServer.keyBlob = Buffer.from(stdout, 'hex'); // Key
      },
  );
}

export default { execute };
