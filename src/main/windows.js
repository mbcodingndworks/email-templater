const { BrowserWindow,dialog } = require('electron');
const path = require('path');
const TemplateProvider = require('./Provider.js');
const { SCHEME } = require('./server');

let homeWindow = undefined;
let ExternalPreviewWindow = undefined;
let SettingWindow = undefined;

var ApplicationViewStack = [];

async function homeWindowSetup(AppSettings) {
  // I valori nel DB sono TEXT: vanno convertiti in numero
  const savedWidth = parseInt(AppSettings.Get('ApplicationWindowWidth'));
  const savedHeight = parseInt(AppSettings.Get('ApplicationWindowHeight'));
  homeWindow = new BrowserWindow({
    width: Number.isFinite(savedWidth) ? savedWidth : 1200,
    height: Number.isFinite(savedHeight) ? savedHeight : 800,
    fullScreenable: true,
    webPreferences: {
      preload: path.join(__dirname, '../renderer/preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  ApplicationViewStack.push(homeWindow);
  // homeWindow.setMinimumSize(800, 800);

  if(AppSettings.Get('debugMode') == 'true') homeWindow.webContents.openDevTools({ mode: 'detach' });
  await homeWindow.loadURL(`${SCHEME}://app/application.html`);
  homeWindow.on('resized',async ()=>{
    try {
      var s = homeWindow.getSize();
      // Aggiorna anche AppSettings, altrimenti il prossimo Save() riscriverebbe le dimensioni vecchie
      AppSettings.Set('ApplicationWindowHeight', String(s[1]));
      AppSettings.Set('ApplicationWindowWidth', String(s[0]));
      await TemplateProvider.InsertSetting('ApplicationWindowHeight', String(s[1]));
      await TemplateProvider.InsertSetting('ApplicationWindowWidth', String(s[0]));
    } catch (err) { //TODO: handle error?
    }
  });
  homeWindow.on('close',async ()=>{ try { CloseAppWindows(); } catch (err) { console.error(err); } });

}

async function ExternalPreviewSetup(AppSettings) {
  ExternalPreviewWindow = new BrowserWindow({
    useContentSize: true,
    fullScreenable: true,
    webPreferences: {
      preload: path.join(__dirname, '../renderer/preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  ExternalPreviewWindow.menuBarVisible = false;
  ExternalPreviewWindow.setTitle('Email-Templater - External Preview');
  ApplicationViewStack.push(ExternalPreviewWindow);
  // homeWindow.setMinimumSize(800, 800);
  if(AppSettings.Get('debugMode') == 'true') ExternalPreviewWindow.webContents.openDevTools({ mode: 'detach' });
  await ExternalPreviewWindow.loadURL(`${SCHEME}://app/epreview.html`);
  ExternalPreviewWindow.once('close',async ()=>{
    MenuClickInterrupt({ cmd: 'epreview' , closed: true})
  })
  ExternalPreviewWindow.on('resized',()=>{
    var s = ExternalPreviewWindow.getSize();
  })
}


async function SettingsViewSetup(AppSettings) {
  SettingWindow = new BrowserWindow({
    useContentSize: true,
    fullScreenable: true,
    webPreferences: {
      preload: path.join(__dirname, '../renderer/preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  SettingWindow.menuBarVisible = false;
  SettingWindow.setTitle('Email-Templater - Settings');
  ApplicationViewStack.push(SettingWindow);
  // homeWindow.setMinimumSize(800, 800);
  if(AppSettings.Get('debugMode') == 'true') SettingWindow.webContents.openDevTools({ mode: 'detach' });
  await SettingWindow.loadURL(`${SCHEME}://app/settings.html`);
  SettingWindow.once('close', () => { MenuClickInterrupt({ cmd: 'settingsview' , closed: true}) });
  SettingWindow.on('resized',() => {  var s = SettingWindow.getSize(); })
}

const MenuClickInterrupt = (data) => { homeWindow.webContents.send('invokeMenuCommand', data); };
const UpdatePreviewData = (data) => { ExternalPreviewWindow.webContents.send('invokePreviewData', data); }

const getHomeWindow = () => homeWindow;
const getExternalPreviewWindow = () => ExternalPreviewWindow;
const getSettingWindow = () => SettingWindow;

const MessaggioInfo = (msg) => { dialog.showMessageBox(undefined,{message: msg,type: 'info',}); };
const MessaggioErrore = (msg) => { dialog.showErrorBox("Application error",msg); };

const CloseAppWindows = async () => {
  BrowserWindow.getAllWindows().forEach(win => win.close());
  // await Windows.homeWindowSetup(AppSettings);
};

const ShowSaveFileDialog = async (defaultPath, filters) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    defaultPath: defaultPath,
    filters: filters
  });
  if (canceled || !filePath) return null;
  return filePath;
}


const ShowSaveFileDialogExportDatabase = async () => {
  return await ShowSaveFileDialog('database_export.db', [
    { name: 'File Database', extensions: ['db'] },
    { name: 'Tutti i file', extensions: ['*'] }
  ]);
}

const ShowSaveFileDialogExportHTML = async () => {
  return await ShowSaveFileDialog('documento.html', [
    { name: 'File HTML', extensions: ['html'] },
    { name: 'Tutti i file', extensions: ['*'] }
  ]);
}

const ShowOpenFileDialog = async (title,filters) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: 'Seleziona uno o più file',
    filters: filters,
    properties: ['openFile']
  });
  if (canceled || !filePaths || filePaths.length === 0) return null;
  return filePaths[0];
}

const ShowOpenFileDialogImportDatabase = async () => {
  return await ShowOpenFileDialog('Seleziona uno o più file', [
    { name: 'File Database', extensions: ['db'] },
    { name: 'Tutti i file', extensions: ['*'] }
  ]);
}

module.exports = {
  homeWindowSetup,
  ExternalPreviewSetup,
  SettingsViewSetup,
  MenuClickInterrupt,
  UpdatePreviewData,
  getHomeWindow,
  getExternalPreviewWindow,
  getSettingWindow,
  MessaggioInfo,
  MessaggioErrore,
  CloseAppWindows,
  ShowOpenFileDialogImportDatabase,
  ShowSaveFileDialogExportDatabase,
  ShowSaveFileDialogExportHTML
};
