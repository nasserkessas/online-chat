import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

const clients = new Set();

wss.on("connection", (socket, req) => {
  
  log(`new connection`);
  log(req.url);
  clients.add(socket);

  socket.on('message', function (message) {
    log(`message received: ${message}`);

    message = message.slice(0, 50); // max message length will be 50

    for (let client of clients) {
      client.send(message);
    }
  });

  socket.on('close', function () {
    log(`connection closed`);
    clients.delete(socket);
  });
})

let log = console.log;