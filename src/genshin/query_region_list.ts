import * as protobuf from 'protobufjs';
import http from 'http';
import colors from 'colorts';

class QueryRegionList {
  async queryList() {
    const queryRegionList =
      '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';

    const root = await protobuf.load(
        'src/proto/QueryRegionListHttpRsp.proto',
    );
    const testMessage = root.lookupType('QueryRegionListHttpRsp');
    const message = testMessage!
        .decode(Buffer.from(queryRegionList, 'base64'))
        .toJSON();

    message['regionList'][0].title = 'Pancake - TS';

    const encoded = testMessage!.encode(message).finish();

    console.log(
        colors(
            '[HTTP] QueryCurRegion with a region list of: ',
        ).blue.toString(),
    );
    console.log(message);

    return encoded;
  }

  async execute(res: http.ServerResponse) {
    const ret = await this.queryList();
    res.end(Buffer.from(ret).toString('base64'));
  }
}

export default QueryRegionList;
