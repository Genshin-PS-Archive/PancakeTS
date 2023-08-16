
import HttpServer from './http';
import { KcpServer } from './server';

const kcpServer = new KcpServer('0.0.0.0', 22102);
kcpServer.start();

// Servers listen to local ip if you use '0.0.0.0' instead of 127.0.0.1
const httpServer = new HttpServer('0.0.0.0', 80);
httpServer.start();
