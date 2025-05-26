const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const config = require("../config.json");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

var PORT = config.port;

class Message 
{
    constructor(author, message)
    {
        this.author = author;
        this.message = message;
    }
}

let messages = [];

wss.on('connection', (ws) => {
    console.log('Nowe połączenie');

    let enter_message = new Message("[HOST]", "UŻYTKOWNIK SIĘ POŁĄCZYŁ");
    messages.push(enter_message);

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'new-message', data: enter_message }));
        }
    });

    ws.send(JSON.stringify({ type: 'init', messages }));

    ws.on('message', (data) => {
        const msg = JSON.parse(data);


        if (msg.type === 'get-messages') {
            ws.send(JSON.stringify({ type: 'init', data: messages }));
        }

        if (msg.type === 'new-message') {
            console.log("Nowa wiadomość");
            messages.push(new Message(msg.data.author, msg.data.message));

            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'new-message', data: msg.data }));
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Połączenie zamknięte');

        let quit_message = new Message("[HOST]", "UŻYTKOWNIK SIĘ ROZŁĄCZYŁ");
        messages.push(quit_message);

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'new-message', data: quit_message }));
            }
        });
    });
});

server.listen(PORT, () => {
    console.log(`Serwer SnippetShare działa na porcie ${PORT}`);
});