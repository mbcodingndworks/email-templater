const { app, ipcMain, Menu, dialog } = require('electron');
const fs = require('fs');
const TemplateProvider = require('./Provider.js');
const { registerAppProtocol } = require('./server');
const BaseMenu = require('./menu.js');
const Windows = require('./windows.js');
const registerVariablesIpc = require('./ipc/Variables.js');
const registerTemplateIpc = require('./ipc/Templates.js');
const registerSettingsIpc = require('./ipc/Settings.js');

let AppSettings;
let previewContent = undefined;

ipcMain.handle('View', async (event, arg) => {
  if( arg == 'ExternalPreview') return await Windows.ExternalPreviewSetup(AppSettings);
  // if( arg == 'Logs') { return await LogsWindowSetup();  }
  if( arg == 'Settings') { return await Windows.SettingsViewSetup(AppSettings); }
})

ipcMain.handle('previewContent',async (event, arg) => { if(arg.content !== undefined) {  await Windows.UpdatePreviewData(arg.content); previewContent = arg.content; } else return previewContent; })
ipcMain.handle('GetBrowserSize', async (event,arg) => { const hw = Windows.getHomeWindow(); return {size: hw.getSize(), bounds: hw.getBounds(), csize: hw.getContentBounds() } } )


async function OnLoad() {
  AppSettings = new TemplateProvider.AppSettings();
  registerAppProtocol();
  registerTemplateIpc();
  registerVariablesIpc();
  registerSettingsIpc(AppSettings);
  var m = new BaseMenu.BaseMenuContext(Windows.MenuClickInterrupt);
  Menu.setApplicationMenu(Menu.buildFromTemplate(m.AppMenu));
  await Windows.homeWindowSetup(AppSettings);
}



app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(OnLoad).catch((err) => { Windows.MessaggioErrore(err.message); console.error(err.message); app.quit();});






