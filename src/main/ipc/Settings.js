const { ipcMain, app } = require('electron');
const TemplateProvider = require('../Provider.js');
const Windows = require('../windows.js');
let AppSettings;
let currentTheme = undefined;

module.exports = function registerSettingsIpc(settings) {
    AppSettings = settings;

    ipcMain.handle('WriteSetting', async (event, arg) => { 
        AppSettings.Set(arg.key, arg.val); AppSettings.Save(); 
        return true; })
    ipcMain.handle('ReadSetting', async (event, arg) => { return AppSettings.Get(arg.key); })
    ipcMain.handle('ResetDatabase', async (event, arg) => {
        await Windows.CloseAppWindows();
        var res = await TemplateProvider.ResetDatabase();
        AppSettings.Load();
        await Windows.homeWindowSetup(AppSettings);
        return res;
    })
    ipcMain.handle('ExportDatabase', async (event, arg) => {
        var path = await Windows.ShowSaveFileDialogExportDatabase();
        if (!path) return null;
        return await TemplateProvider.exportDatabase(path);
    })

    ipcMain.handle('GetDatabasePath', async (event, arg) => { return await TemplateProvider.GetDatabasePath(); })
    ipcMain.handle('GetCurrentTheme', async (event, arg) => { return currentTheme; })
    ipcMain.handle('SetCurrentTheme', async (event, arg) => { currentTheme = arg; return true; })
    ipcMain.handle('SaveHtmlFile', async (event, contenuto) => {
        var path = await Windows.ShowSaveFileDialogExportHTML();
        if (path == null) return;
        fs.writeFileSync(filePath, contenuto);
        return filePath;
    });
    ipcMain.handle('ImportDatabase', async (event, arg) => {
        var path = await Windows.ShowOpenFileDialogImportDatabase();
        if (path == null) return;
        var res = await TemplateProvider.ImportDatabase(path);
        await Windows.CloseAppWindows();
        app.relaunch();
        app.exit(0);
        return res;
    })
}