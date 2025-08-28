import { app, BrowserWindow } from "electron";
import path from "path";

let mainWindow;

async function createWindow() {
  const isDev = true;

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:8081"
      : `file://${path.join(__dirname, "dist", "index.html")}`
  );
}

app.on("ready", () => {
  createWindow();
});