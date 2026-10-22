const { ipcMain } = require('electron');
const TemplateProvider = require('../Provider.js');

module.exports = function registerTemplateIpc() {
  ipcMain.handle('insertTemplate', async (event, arg) => {
    return await TemplateProvider.insertTemplate(arg);
  });

  ipcMain.handle('getTemplate', async (event, arg) => {
    return await TemplateProvider.GetTemplateByID(arg.templateid);
  });

  ipcMain.handle('getTemplates', async (event, arg) => {
    return await TemplateProvider.GetAllTemplatesNoContent();
  });

  ipcMain.handle('saveTemplate', async (event, arg) => {
    return await TemplateProvider.UpdateTemplateContent(arg.ID, arg.CONTENT);
  });

  ipcMain.handle('updateTemplateName', async (event, arg) => {
    return await TemplateProvider.UpdateTemplateName(arg.ID, arg.NAME);
  });

  ipcMain.handle('RemoveTemplate', async (event, arg) => {
    return await TemplateProvider.DeleteTemplatesByID(arg.ID);
  });
};