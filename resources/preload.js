const { contextBridge, ipcRenderer } = require('electron');
console.log('Preload.js załadowany!');


contextBridge.exposeInMainWorld('electronAPI', {
    onUsernameInit: (callback) => ipcRenderer.on('username:init', (event, username) => callback(username)),
    getMessages: () => ipcRenderer.invoke('get-messages'),
    sendMessage: (msg) => ipcRenderer.send('new-message', msg),
    onNewMessage: (callback) => ipcRenderer.on('new-message', (event, data) => callback(data)),

    sendWebSocketMessage: (msg) => ipcRenderer.send('new-websocket-message', msg),
    getMessagesFromServer: () => ipcRenderer.invoke('get-server-messages')
});
