const net = require('net');
const WebSocket = require('ws');

const guaritaSockets = {}; // Objeto para armazenar os sockets dos módulos de guarita

const tcpServer = net.createServer((socket) => {
    console.log('Cliente TCP conectado');

    socket.on('data', (data) => {
        const message = data.toString();
        console.log(message)
        if (message.startsWith('@')) {
        // Mensagem de inicialização com formato especial: @mac@id@keepAlive
        const [, id] = message.split('@').slice(1);
        console.log(`Equipamento com ID único ${id} se conectou.`);
        
        // Associar o ID único com o socket para identificar a conexão
        guaritaSockets[id] = socket;

        const idsOnly = Object.keys(guaritaSockets);
            const idsJSON = JSON.stringify(idsOnly, null, 2);

            console.log(idsJSON);

        // Implemente a lógica para lidar com as mensagens recebidas deste equipamento específico
        } else {
        // Mensagem regular recebida de um equipamento identificado pelo ID
        // Implemente a lógica para processar as mensagens regulares
        }
    });
    socket.on('end', () => {
        // Quando o cliente se desconectar, desassocie o socket do ID
        console.error(`Conexão foi fechada: ${err.message}`);
        desassociarSocket(socket)
    });
    
    socket.on('error', (err) => {
        // Quando ocorre um erro com o socket, desassocie o ID do socket
        console.error(`Erro no socket: ${err.message}`);
        desassociarSocket(socket)
    });

    socket.on('close', () => {
        // Quando a conexão é fechada, desassocie o ID do socket
        desassociarSocket(socket);
    });
});

function desassociarSocket(socket) {
    const idToRemove = Object.keys(guaritaSockets).find(key => guaritaSockets[key] === socket);
    if (idToRemove) {
        delete guaritaSockets[idToRemove];
        console.log(`Equipamento com ID único ${idToRemove} foi desassociado da conexão.`);
    }
}

function conectarWebSocket() {
    const wsClient = new WebSocket('ws://localhost:9001');
  
    wsClient.on('open', () => {
        console.log('Conectado ao servidor WebSocket');
  
        wsClient.on('message', (message) => {
            console.log(`Recebida mensagem do servidor WebSocket: ${message}`);
            // Implemente a lógica para processar mensagens recebidas do servidor WebSocket, se necessário
            try {
                const parsedMessage = JSON.parse(message);
                const { id, mensagem } = parsedMessage;

                if (guaritaSockets[id]) {
                    // Verificar se o módulo de guarita está conectado
                    if (guaritaSockets[id].writable) {
                    // Converter o comando em bytes (frame) antes de enviar
                    const buffer = Buffer.from(mensagem, 'utf-8');
                    guaritaSockets[id].write(buffer);
                    console.log(`Comando enviado para o módulo de guarita com ID ${id}: ${mensagem}`);
                } else {
                    console.log(`Módulo de guarita com ID ${id} não encontrado.`);
                }
                } else {
            console.log(`Módulo de guarita com ID ${id} não encontrado.`);
        }
            } catch (error) {
                console.error(`Erro ao analisar a mensagem: ${error.message}`);
            }
        });
    
        wsClient.on('error', (error) => {
            console.error(`Erro de conexão com o servidor WebSocket: ${error.message}`);
            // Implemente a lógica para lidar com erros de conexão, se necessário
        });
    
        wsClient.on('close', () => {
            console.log('Conexão com o servidor WebSocket fechada');
                // Implemente a lógica para lidar com a desconexão do servidor WebSocket, se necessário
    
                // Tentar reconectar após um intervalo de tempo (por exemplo, 5 segundos)
            setTimeout(() => {
                conectarWebSocket();
            }, 5000);
        });
    });
}

// Iniciar a conexão inicial
conectarWebSocket();

module.exports = tcpServer;
