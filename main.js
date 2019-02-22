// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  dialog,
  Menu,
  MenuItem,
} = require('electron');
// import { autoUpdater } from "electron-updater"
const {
  autoUpdater,
} = require('electron-updater');

const log = require('electron-log');
log.transports.file.level = 'info';
const path = require('path');
const debug = /--debug/.test(process.argv[2]);

let filePath = '';
// let filePath = path.join('file://', __dirname, '/build/generic/web/pdf-readme.pdf');
let launchUrl = path.join('file://', __dirname, '/build/generic/web/index.html');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}
let promptUpdateAvailable = () => {
  dialog.showMessageBox(
    {
      type: 'info',
      message: 'Update Available',
      buttons: ['Background download'],
      defaultId: 0,
    },
    (clickedIndex) => {
      if (clickedIndex === 0) {
        console.log('start downloading');
      }
    }
  );
};

let promptUpdateDownloaded = () => {
  dialog.showMessageBox(
    {
      type: 'question',
      message: 'Update Downloaded',
      buttons: ['Install', 'Close'],
      defaultId: 0,
    },
    (clickedIndex) => {
      if (clickedIndex === 0) {
        // This will install and then restart the app automatically.
        // If the user dismisses this, the app will be auto-updated next time
        // they restart.
        autoUpdater.quitAndInstall();
      }
    }
  );
};

let promptUpdateFail = () => {
  dialog.showMessageBox(
    {
      type: 'error',
      message: 'Download fail',
      buttons: ['ok'],
      defaultId: 0,
    },
    (clickedIndex) => {
      if (clickedIndex === 0) {
      }
    }
  );
};

function createWindow() {
  // Create the browser window.
  log.info('starting');
  win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  // and load the index.html of the app.
  // win.loadFile('/build/generic/web/viewer.html')
  if (debug) {
    // Open the DevTools.
    promptUpdateAvailable();
    promptUpdateDownloaded();
    promptUpdateFail();
    win.webContents.openDevTools();
    win.loadURL(path.join('http://127.0.0.1:9000/web/index.html'));
  } else {
    // for init title
    if (filePath !== '') {
      win.loadURL(launchUrl + '?file=' + filePath);
    } else {
      win.loadURL(launchUrl);
    }
  }
  // Emitted when the window is closed.
  autoUpdater.checkForUpdates();
  /*
  //关闭了主进程中的渲染
  win.webContents.on('context-menu', (e, params) => {
    let menu = new Menu()
    let message = 'o'
    message = message + "f"
    menu.append(new MenuItem({
      label: message
    }))
    menu.popup(win, params.x, params.y)
    // alert(1) main中没有alert
    // 需要在渲染进程中做
  })
  */
  /*
  let template=[];
  const name =app.getName();
  template.unshift({
    label:name,
    submenu:[
      {
        label:'About '+ name,
        role: 'about'
      }
    ]
  })
  const menu =Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  */
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
  promptUpdateAvailable();
  sendStatusToWindow('Update available.');
});
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
});
autoUpdater.on('error', (err) => {
  promptUpdateFail();
  sendStatusToWindow('Error in auto-updater. ' + err);
});
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + '/' +
    progressObj.total + ')';
  sendStatusToWindow(log_message);
});
autoUpdater.on('update-downloaded', (info) => {
  promptUpdateDownloaded();
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
// for windows---------------------------------------------

if (process.argv) {
    log.info(process.argv);
    if (process.argv[1]) {
      log.info('----------------------- app argv-file ---------------------------------------', process.argv[1]);
      filePath = process.argv[1];
    }
  }
app.on('open-file', function(event, path) {
  log.info('----------------------- app open-file ---------------------------------------', path);
  filePath = path;
  event.preventDefault();
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
