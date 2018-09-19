import { app, BrowserWindow, Menu } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
require('update-electron-app')()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let myAppMenu, menuTemplate;
let path = require('path')
const template = [
  {
      label: 'SIS Inventory Management',
      submenu: [
          {role: 'quit'},
          {role: 'close'}
      ]
  },
  {
      label: 'Edit',
      submenu: [
          { role: 'undo'},
          { role: 'redo' },
          { type: 'separator'},
          { role: 'cut'
          },
          {
              role: 'copy'
          },
          {
              role: 'paste'
          },
          {
              role: 'pasteandmatchstyle'
          },
          {
              role: 'delete'
          },
          {
              role: 'selectall'
          }
      ]
  },
  {
      label: 'View',
      submenu: [
          {
              role: 'reload'
          },
          {
              role: 'toggledevtools'
          },
          {
              type: 'separator'
          },
          {
              role: 'resetzoom'
          },
          {
              role: 'zoomin'
          },
          {
              role: 'zoomout'
          },
          {
              type: 'separator'
          },
          {
              role: 'togglefullscreen'
          }
      ]
  },
];

const menu = Menu.buildFromTemplate(template)
const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });


const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
  });
  Menu.setApplicationMenu(menu)
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
