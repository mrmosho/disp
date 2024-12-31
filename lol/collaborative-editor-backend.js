const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const cors = require('cors');
const { setupWSConnection } = require('y-websocket/bin/utils');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req);
});

const PORT = process.env.PORT || 1234;
server.listen(PORT, () => {
  console.log(`Collaborative editor server running on port ${PORT}`);
});
