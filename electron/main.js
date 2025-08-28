import { app, BrowserWindow } from "electron";
import serve from "electron-serve";

const loadURL = serve({directory: "public"});

app.on("ready", async () => {
  const isDev = true;

  const mainWindow = new BrowserWindow();

  await loadURL(mainWindow);

  // The `-` is just the required hostname
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
});
