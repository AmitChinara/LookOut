const WebSocket = require('ws');

const clients = new Set();

// Function to add a new WebSocket client
const addClient = (ws) => {
    clients.add(ws);
    ws.on('close', () => {
        clients.delete(ws);
    });
};

// Function to send status updates to all clients
const broadcastStatusUpdate = (data) => {
    const message = JSON.stringify(data);
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};

module.exports = { addClient, broadcastStatusUpdate };
