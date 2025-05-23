const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;
const CreateWindow = () => {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 800,
        webPreferences: {
            nodeIntegration: true,  // ustawienie na false dla bezpieczeństwa
            contextIsolation: false
        },
        autoHideMenuBar: true,
        resizable: false,
    });

    mainWindow.loadFile('src/index.html');
};

app.whenReady().then(CreateWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});