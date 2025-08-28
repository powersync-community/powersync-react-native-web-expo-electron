const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

async function createWindow() {
  const isDev = true;

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  mainWindow.loadURL("http://localhost:8081");
}

app.on("ready", () => {
  createWindow();
});
