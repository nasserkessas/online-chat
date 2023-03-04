import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ noServer: true });

const clients = new Set();

function accept(req, res) {

  if (req.url == '/ws' && req.headers.upgrade &&
    req.headers.upgrade.toLowerCase() == 'websocket' &&
    // can be Connection: keep-alive, Upgrade
    req.headers.connection.match(/\bupgrade\b/i)) {
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
  } else { // page not found
    res.writeHead(404);
    res.end();
  }
}

function onSocketConnect(ws) {
  clients.add(ws);
  log(`new connection`);

  ws.on('message', function (message) {
    log(`message received: ${message}`);

    message = message.slice(0, 50); // max message length will be 50

    for (let client of clients) {
      client.send(message);
    }
  });

  ws.on('close', function () {
    log(`connection closed`);
    clients.delete(ws);
  });
}

let log = console.log;

createServer(accept).listen(8080);
