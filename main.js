// Modules to control application life and create native browser window
const { app, BrowserWindow, } = require('electron');
// import { autoUpdater } from "electron-updater"
const log = require('electron-log');
const { autoUpdater, } = require('electron-updater');
const path = require('path');
const debug = /--debug/.test(process.argv[2]);
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}

function createWindow() {
  // Create the browser window.
  log.info('starting');
  win = new BrowserWindow({ width: 800, height: 600, });

  // and load the index.html of the app.
  // win.loadFile('/build/generic/web/viewer.html')
  win.loadURL(path.join('file://', __dirname, '/build/generic/web/viewer.html'));
  if (debug) {
  // Open the DevTools.
  win.webContents.openDevTools();
  }
  // Emitted when the window is closed.
  autoUpdater.checkForUpdatesAndNotify();
  win.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking');
});
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
});
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
});
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
});
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
  sendStatusToWindow(log_message);
});
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
