// Importa as bibliotecas necessárias
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const { broadcast } = require('./websocketServer.js');


const app = express();
const httpServer = http.createServer(app);

app.use(bodyParser.json());

app.get('/', (req, res) => {
  console.log('Bem Vindo a Guardify V1.0.0');
});

// Rota para enviar mensagem para os clientes WebSocket
app.post('/enviar-mensagem', (req, res) => {
    const { id, mensagem } = req.body;

    if (id && mensagem) {
        const messageObj = { id, mensagem };
        const messageString = JSON.stringify(messageObj);

        // Envia a mensagem para os clientes WebSocket
        broadcast(messageString);

        // Envia uma resposta para o cliente HTTP
        res.send(`Mensagem para o ID ${id} enviada com sucesso: ${mensagem}`);
    } else {
        res.status(400).send('ID e mensagem são obrigatórios.');
    }
});


module.exports = httpServer;
