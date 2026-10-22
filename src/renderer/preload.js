const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
  // we can also expose variables, not just functions
})

contextBridge.exposeInMainWorld('providerAPI', {
  insertTemplate: (obj) => ipcRenderer.invoke('insertTemplate', obj),
  getTemplate: (id) => ipcRenderer.invoke('getTemplate', { templateid: id }),
  getTemplates: () => ipcRenderer.invoke('getTemplates', undefined),
  saveTemplate: (id, content) => ipcRenderer.invoke('saveTemplate', { ID: id, CONTENT: content }),
  updateTemplateName: (id, name) => ipcRenderer.invoke('updateTemplateName', { ID: id, NAME: name }),
  removeTemplate: (id) => ipcRenderer.invoke('RemoveTemplate', { ID: id }),
  insertVariable: (obj) => ipcRenderer.invoke('insertVariables', obj),
  getVariables: (id) => ipcRenderer.invoke('getVariables', { id_template: id }),
  removeVariables: (id) => ipcRenderer.invoke('RemoveVariables', { ID: id }),
  UpdateVariables: (obj) => ipcRenderer.invoke('UpdateVariables', obj),
  settingSet: (k, v) => { ipcRenderer.invoke('WriteSetting', { key: k, val: v }) },
  settingRead: (k) => ipcRenderer.invoke('ReadSetting', { key: k }),
  // salvaDato: (dato) => ipcRenderer.send('salva-dato', dato),
  // leggiDato: (dato) => ipcRenderer.invoke('leggi-dato', dato)
  // onMessaggioMain: (callback) => ipcRenderer.on('messaggio-dal-main', (_event, data) => callback(data))
  previewContent: (f) => ipcRenderer.invoke('previewContent', { content: f }),
  onMenuCommand: (callback) => { ipcRenderer.on('invokeMenuCommand', (_event, data) => { callback(data); });
  },
  onPreviewData: (callback) => { ipcRenderer.on('invokePreviewData', (_event, data) => { callback(data); });
  },
  ChangeView: (v) => ipcRenderer.invoke('View', v),
  WindowSize: () => ipcRenderer.invoke('GetBrowserSize', undefined),
  ResetDatabase: () => ipcRenderer.invoke('ResetDatabase', undefined),
  ExportDatabase: () => ipcRenderer.invoke('ExportDatabase', undefined),
  ImportDatabase: () => ipcRenderer.invoke('ImportDatabase', undefined),
  GetDatabasePath: () => ipcRenderer.invoke('GetDatabasePath', undefined),
  SaveFile: (content) => ipcRenderer.invoke('SaveHtmlFile', content),
  GetCurrentTheme: () => ipcRenderer.invoke('GetCurrentTheme', undefined),
  SetCurrentTheme: (theme) => ipcRenderer.invoke('SetCurrentTheme', theme)

});