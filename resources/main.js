const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const WebSocket = require('ws');
const { GenerateUsername } = require('./client');
const username = GenerateUsername();

var PORT = 3035;

const ws = new WebSocket(`ws://localhost:${PORT}`);


class Message 
{
    constructor(author, message)
    {
        this.author = author;
        this.message = message;
    }
}

// let all_messages = [
//     new Message("User2137", "HAHAHAHAHAHAHAHAHAHAHA"),
//     new Message("User0000", "kretyn"),
// ];

let mainWindow;
const CreateWindow = () => {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 850,
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