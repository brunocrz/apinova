require('dotenv').config();
const httpServer = require('./src/httpServer.js');
const tcpServer = require('./src/tcpServer.js');
const { createWebSocketServer } = require('./src/websocketServer.js');

// Inicia o servidor HTTP
const PORT_HTTP = process.env.PORT_HTTP || 9003;
httpServer.listen(PORT_HTTP, () => {
  console.log(`API HTTP e Websocket está ouvindo na porta ${PORT_HTTP}`);
});

// Inicia o servidor TCP
const PORT_TCP = process.env.PORT_TCP || 9002;
tcpServer.listen(PORT_TCP, () => {
  console.log(`API TCP está ouvindo na porta ${PORT_TCP}`);
});

const wsServer = createWebSocketServer(httpServer);