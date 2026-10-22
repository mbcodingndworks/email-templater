const { ipcMain } = require('electron');
const TemplateProvider = require('../Provider.js');

module.exports = function registerVariablesIpc() {

    ipcMain.handle('insertVariables', async (event, arg) => {
        return await TemplateProvider.insertVariables(arg);
    });

    ipcMain.handle('UpdateVariables', async (event, arg) => {
        return await TemplateProvider.UpdateVariables(arg);
    });

    ipcMain.handle('getVariables', async (event, arg) => {
        return await TemplateProvider.GetVariablesByIDTemplate(arg.id_template);
    });

    ipcMain.handle('RemoveVariables', async (event, arg) => {
        return await TemplateProvider.DeleteVariablesByID(arg.ID);
    });
}