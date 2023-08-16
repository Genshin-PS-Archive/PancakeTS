// This things are protobuffers
// https://protogen.marcgravell.com/decode
import * as protobuf from 'protobufjs';
import http from 'http';
import colors from 'colorts';

import * as cur from './cur.json';

class QueryCurRegion {
  async queryCur() {
    const queryRegionList = cur['2.5.50'][1];
    try {
      const root = protobuf.load('src/proto/QueryCurrRegionHttpRsp.proto');
    } catch (e) {
      colors('[HTTP | query_cur_region] Could not load proto: %e').blue.toString();
    }
   
    const testMessage = (await root!).lookupType(
        'QueryCurrRegionHttpRsp',
    );

    const pQuery = testMessage!
        .decode(Buffer.from(queryRegionList, 'base64'))
        .toJSON();

    pQuery.regionInfo.gateserverIp = '127.0.0.1';
    pQuery.regionInfo.gateserverPort = 22102;

    const encoded = testMessage!.encode(pQuery).finish();

    console.log(
        colors(
            '[HTTP] QueryCurRegion with a region info of: ',
        ).blue.toString(),
    );
    console.log(pQuery['regionInfo']);

    return encoded;
  }

  async execute(res: http.ServerResponse) {
    const ret = await this.queryCur();
    res.end(Buffer.from(ret).toString('base64'));
  }
}

export default QueryCurRegion;
