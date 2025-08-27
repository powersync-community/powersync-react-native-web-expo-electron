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
            webSecurity: false, // Disable web security to allow local file loading
        },
        show: false
    });
    // Show window when ready to prevent visual flash
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
    // Load the built web files
    const distPath = path.join(__dirname, '../dist/index.html');
    console.log('Looking for build files at:', distPath);
    console.log('File exists:', fs.existsSync(distPath));
    if (fs.existsSync(distPath)) {
        console.log('Loading file:', distPath);
        mainWindow.loadFile(distPath);
    }
    else {
        // Show error if build files don't exist
        const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Build Error</title>
          <style>
            body { 
              font-family: system-ui; 
              padding: 40px; 
              text-align: center;
              background: #f5f5f5;
            }
            .error { 
              background: white; 
              padding: 30px; 
              border-radius: 8px; 
              max-width: 500px; 
              margin: 0 auto;
            }
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
    // On macOS, re-create window when dock icon is clicked
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
// Quit when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
