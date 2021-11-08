/* Import node modules */
const { app, BrowserWindow, protocol } = require("electron");
const Store = require('electron-store');
const config = require("./config.json");
/*Enable storing*/
const store = new Store();

/* Disable gpu and transparent visuals if not win32 or darwin */
if (process.platform !== "win32" && process.platform !== "darwin") {
  app.commandLine.appendSwitch("enable-transparent-visuals");
  app.commandLine.appendSwitch("disable-gpu");
  app.disableHardwareAcceleration();
}
function createMainWindow() {
  const MainWindow = (global.MainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 800,
    minHeight: 400,
    center: true,
  }));
  MainWindow.loadURL("http://192.168.2.7:8080?redir=portaltest://login");
  //MainWindow.webContents.openDevTools();
}
/* When app ready, show window */
app.whenReady().then(() => {
  /* Custom URI handler for linux and windows */
  app.setAsDefaultProtocolClient("portaltest");
  protocol.registerHttpProtocol('portaltest', (req, cb) => {
    const url = req.url.substr(13)
    var data = new Array ();
    let str2 = url.replace(":", " ");
    let arr2 = str2.split(' ',2);
    mode = arr2[0]
    data[0] = arr2[1]
    console.log("Logging in: "+data[0]);
    data[0].replace("//?token=", " ").split(' ',2);
    console.log("Token data: "+data[0])
    store.set('token', data[0]);
    MainWindow.loadFile('index.html');
  })
  /* Custom URI handler for mac */
  app.on("open-url", (event, url) => {
    const url2 = url.substr(13)
    var data = new Array ();
    let str2 = url2.replace(":", " ");
    let arr2 = str2.split(' ',2);
    mode = arr2[0]
    data[0] = arr2[1]
    console.log("Logging in: "+data[0]);
    data[0].replace("//?token=", " ").split(' ',2);
    console.log("Token data: "+data[0])
    store.set('token', data[0]);
    MainWindow.loadFile('index.html');
  });
});
/* If all windows are closed, quit app, exept if on darwin */
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
/* App ready */
app.on('ready', () => {
  /* Create windows */
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  } else {
    global.MainWindow && global.MainWindow.focus();
  }
})
