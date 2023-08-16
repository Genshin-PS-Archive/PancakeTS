import http from 'http';
import { URL } from 'url';
import colors from 'colorts';
import * as fs from 'fs';

import QueryCurRegion from './genshin/query_cur_region';
import QueryRegionList from './genshin/query_region_list';

class HttpServer {
  host: string;
  port: number;

  constructor(host: string, port: number) {
    this.host = host;
    this.port = port;
  }

  start() {
    const server: http.Server = http.createServer((req, res) => {
      const url: URL = new URL(req.url!, `http://${req.headers.host}`);

      // Handle Favicon Error
      if (url.pathname == '/favicon.ico') {
        res.writeHead(200, { 'Content-Type': 'image/x-icon' });
        res.end();
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      console.log(
          colors('[HTTP] REQ URL: %s').cyan.toString(),
          url.href,
      );

      // I feel like shit after doing this, its wacky af

      if (url.pathname.includes('query_cur_region')) {
        new QueryCurRegion().execute(res);
        return;
      } else if (url.pathname.includes('query_region_list')) {
        new QueryRegionList().execute(res);
        return;
      } else if (url.pathname.includes(''))

      try {
        const file = fs.readFileSync(
            `./src/genshin/${url.pathname}.json`,
        );
        res.write(file);
      } catch (e) {
        console.log(
            colors('[HTTP] URL NOT FOUND: %s').blue.toString(),
            url.href,
        );
        res.write('{code:0}');
      }

      res.end();
    });

    server.listen(this.port, this.host, () => {
      console.log(
          colors(
              `[HTTP] Server is running on http://${this.host}:${this.port}`,
          ).cyan.toString(),
      );
    });
  }
}

export default HttpServer;
