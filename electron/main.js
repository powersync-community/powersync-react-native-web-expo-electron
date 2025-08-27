const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity: false,
        },
        show: false
    });

    mainWindow.webContents.openDevTools();

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    const distPath = path.join(__dirname, '../dist/index.html');
    const jsDir = path.join(__dirname, '../dist/_expo/static/js/web');
    let bundlePath = '';
    try {
        const bundleFile = fs.readdirSync(jsDir).find(file => file.startsWith('entry-') && file.endsWith('.js'));
        bundlePath = bundleFile ? path.join(jsDir, bundleFile) : '';
    } catch (err) {
        console.error('Error reading js directory:', err);
    }

    console.log('Looking for index.html at:', path.resolve(distPath));
    console.log('Index.html exists:', fs.existsSync(distPath));
    console.log('Looking for bundle at:', path.resolve(bundlePath));
    console.log('Bundle exists:', fs.existsSync(bundlePath));
    if (fs.existsSync(distPath)) {
        console.log('Loading file:', distPath);
        mainWindow.loadFile(distPath);
    } else {
        const errorHtml = `
            <!DOCTYPE html>
            <html>
              <head>
                <title>Build Error</title>
                <style>
                  body { font-family: system-ui; padding: 40px; text-align: center; background: #f5f5f5; }
                  .error { background: white; padding: 30px; border-radius: 8px; max-width: 500px; margin: 0 auto; }
                </style>
              </head>
              <body>
                <div class="error">
                  <h1>⚠️ Build files not found</h1>
                  <p>Run <code>npm run build:web</code> first</p>
                  <p>Looking for: ${distPath}</p>
                </div>
              </body>
            </html>
        `;
        mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`);
    }

    return mainWindow;
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});