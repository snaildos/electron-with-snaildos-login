const { app, BrowserWindow, protocol } = require("electron");
const Store = require('electron-store');
const config = require("./config.json");
const store = new Store();
const axios = require('axios');
token = store.get('token')

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
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
  }
  }));
  MainWindow.loadURL("https://login.snaildos.com?redir=portaltest://login");
}
app.whenReady().then(() => {
  if (token != null) {
    console.log("Verifying Identity..")
    async function verify() {
      await axios.get('https://api.snaildos.com/users/@me', {
      headers: {
      Authorization: token
      }}
      )
        .then(function (response) {
          // handle success
          if (( response.data.status ) === "false") {
            config.set('token', null)
            MainWindow.loadURL("https://login.snaildos.com?redir=portaltest://login");
            console.log("Token failure!")
          } else {
            console.log("Sucess!")
            MainWindow.loadFile('index.html')
          }
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          MainWindow.loadURL("https://login.snaildos.com?redir=portaltest://login");
          console.log("Token failure!")
        })
        .then(function () {
        });
      }
      verify()
  }
  app.setAsDefaultProtocolClient("portaltest");
  protocol.registerHttpProtocol('portaltest', (req, cb) => {
    const url = req.url.substr(25)
      console.log("Logging in: "+url);
      console.log("Token data: "+url)
      store.set('token', url);
      MainWindow.loadFile('index.html');
  })
  app.on("open-url", (event, url) => {
    const url2 = req.url.substr(25)
    console.log("Logging in: "+url2);
    console.log("Token data: "+url2)
    store.set('token', url2);
    MainWindow.loadFile('index.html');
  });
});
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
app.on('ready', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  } else {
    global.MainWindow && global.MainWindow.focus();
  }
})
