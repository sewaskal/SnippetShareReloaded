const { app, BrowserWindow, ipcMain, Notification, dialog } = require('electron');
const path = require('path');
const config = require("../config.json");
const WebSocket = require('ws');
const { GetUsername, SaveUsername } = require('./client');
const username = GetUsername();
const fs = require('fs');

var HOST = config.host;
var PORT = config.port;

class Message 
{
    constructor(author, message)
    {
        this.author = author;
        this.message = message;
    }
}
const ws = new WebSocket(`ws://${HOST}:${PORT}`);



let mainWindow;
const CreateWindow = () => {
    mainWindow = new BrowserWindow({
        width: 700,
        height: 950,
        icon: __dirname + './src/img/icon.ico',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,  // ustawienie na false dla bezpieczeństwa
            contextIsolation: true
        },
        autoHideMenuBar: true,
        resizable: false,
    });

    mainWindow.loadFile('src/index.html');

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('username:init', username);
    });
};

app.whenReady().then(CreateWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ws.on('error', () => {
    dialog.showErrorBox("Błąd serwera", "Nie można połączyć się z serwerem. Sprawdź czy serwer działa oraz port serwera i klienta się zgadzają");
    app.quit();
});

ipcMain.handle('get-messages', () => {
    return new Promise((resolve) => {
        const onMessage = (event) => {
            const msg = JSON.parse(event.data || event);
            if (msg.type === 'init') {
                ws.removeEventListener('message', onMessage);
                resolve(msg.data);
            }
        };
        ws.on('message', onMessage);
        ws.send(JSON.stringify({ type: 'get-messages' }));
    });
});

ipcMain.on('save-username', (event, username) => {
    SaveUsername(username);
});

// ipcMain.on('new-message', (event, msg) => {
//     console.log("new message!");
//     // all_messages.push(message);
//     event.sender.send('new-message', message);
// }); 

ipcMain.on('new-message', (event, msg) => {
    console.log('new websocket message');
    const message = JSON.stringify(msg);
    ws.send(JSON.stringify({ type: 'new-message', data: msg }));
});

ws.on('open', () => {
    console.log(`Connected to server ${HOST}! Port: ${PORT}`)
});

ws.on('message', (d) => {
    const json = JSON.parse(d);
    if (json.type == "new-message")
    {
        console.log("new message");
        // const message = JSON.parse(d);
        mainWindow.webContents.send('new-message', json);
    }
    
});

console.log(username);