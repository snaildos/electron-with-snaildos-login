/* Import node modules */
const config = require("./config.json");
const { app, BrowserWindow, protocol } = require("electron");
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
  MainWindow.loadURL("http://192.168.200.92:8080/login?redir=portaltest://");
  //MainWindow.webContents.openDevTools();
}
/* When app ready, show window */
app.whenReady().then(() => {
  /* Create main window */
  createMainWindow();
  /* Custom URI handler for linux and windows */
  app.setAsDefaultProtocolClient("portaltest");
  protocol.registerHttpProtocol('portaltest', (req, cb) => {
    const url = req.url.substr(9)
    var data = new Array ();
    let str2 = url.replace(":", " ");
    let arr2 = str2.split(' ',2);
    mode = arr2[0]
    data[0] = arr2[1]
    if (mode == "login") {
      console.log("Logging in: "+data[0]);
      MainWindow.loadURL(`${config.URL}playlist/${data[0]}`);
    }
  })
  /* Custom URI handler for mac */
  app.on("open-url", (event, url) => {
    const url2 = url.substr(9)
    var data = new Array ();
    let str2 = url2.replace(":", " ");
    let arr2 = str2.split(' ',2);
    mode = arr2[0]
    data[0] = arr2[1]
    if (mode == "login") {
      console.log("Logging in: "+data[0]);
      MainWindow.loadURL(`${config.URL}playlist/${data[0]}`);
    }
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
