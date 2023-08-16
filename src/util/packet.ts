// @ts-ignore
import kcp from 'node-kcp';

import { DataUtil } from './dataUtil';

export interface IPacketData {
    data: Buffer,
    metadata?: Buffer
}

export class Packet {
  packetID: number;
  dataLength: number;
  dataUtil = new DataUtil();
  protoName: string;
  protoBuf: any;
  metadataProtoBuf: any;

  // 45670005000c0000000b18f7032801309df197eea02f10cbc4a086062566c889Ab
  constructor(
    public data: IPacketData,
    packetID: number | string,
    public kcpobj: kcp,
    hasCustomName: boolean = false,
  ) {
    this.packetID =
      typeof packetID == 'number' ?
        packetID :
        Number(this.dataUtil.getPacketIDByProtoName(packetID));

    this.dataLength = data.data.length;
    this.protoName = hasCustomName ? packetID as string : this.dataUtil.getProtoNameByPacketID(
        this.packetID.toString(),
    );
  }

  async setProtobuf(customName: string | undefined = undefined) {
    this.protoBuf = await this.dataUtil.dataToProtobuf(
        this.data.data,
        this.packetID.toString(),
        customName,
    );

    if (this.data.metadata != undefined) {
      this.metadataProtoBuf = await this.dataUtil.dataToProtobuf(
          this.data.metadata,
          this.packetID.toString(),
          'PacketHead',
      );
    };
  }
}
