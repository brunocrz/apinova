const WebSocket = require('ws');

// Armazene os clientes WebSocket conectados
const clients = new Set();

// Função para enviar mensagem para todos os clientes WebSocket conectados
function broadcast(message) {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

function createWebSocketServer(httpServer) {
    const wsServer = new WebSocket.Server({ server: httpServer });

    wsServer.on('connection', (webSocket) => {
        console.log('Cliente WebSocket conectado');

        // Adicione o cliente ao conjunto de clientes
        clients.add(webSocket);

        webSocket.on('message', (message) => {
            // Lógica para processar mensagens recebidas do cliente WebSocket
            console.log(`Mensagem recebida: ${message}`);
        });

        // Quando o cliente WebSocket é fechado, remova-o do conjunto de clientes
        webSocket.on('close', () => {
            console.log('Cliente WebSocket desconectado');
            clients.delete(webSocket);
        });

        // Lógica para enviar mensagens para o cliente WebSocket
        // webSocket.send('Mensagem de exemplo para o cliente WebSocket');
    });
}

module.exports = { 
    createWebSocketServer, 
    broadcast 
};
