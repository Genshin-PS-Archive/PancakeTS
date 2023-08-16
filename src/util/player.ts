import * as playerData from './player.json';

export interface IPlayer {
  uid: number;
  name: string;
  signature: string;
  avatarId: number;
  entityId: number;
  motionInfo: MotionInfo;
}

export interface MotionInfo {
  pos: Pos;
  rot: Rot;
}

export interface Pos {
  X: number;
  Y: number;
  Z: number;
}

export interface Rot {
  Y: number;
}

class Player {
    static uid: number;
    static username: string;
    static signature: string;
    static avatarId: number;
    static entityId: number;
    static motionInfo: MotionInfo;
    static _sharedState: Player;

    constructor() {
      // All player data is gotten from player.json
      Player.uid = playerData.uid;
      Player.username = playerData.name;
      Player.signature = playerData.signature;
      Player.avatarId = playerData.avatarId;
      Player.entityId = playerData.entityId;
      Player.motionInfo = playerData.motionInfo;
    }
}

export default Player;
