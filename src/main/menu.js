const { shell, Menu, app } = require('electron');
const process = require('node:process');

const isMac = process.platform === 'darwin'

class BaseMenuContext{

    constructor(fn) {
    this.MenuClickInterruptFn = fn;
  }

get AppMenu() {
    return  [

  ...(isMac
    ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }]
    : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      { label: 'Nuovo', click: async () => { this.MenuClickInterruptFn({ cmd: 'newtemplate' }) } },
      { label: 'Apri', click: async () => { this.MenuClickInterruptFn({ cmd: 'fileopen' }) } },
      { label: 'Salva', click: async () => { this.MenuClickInterruptFn({ cmd: 'savetemplate' }) } },
      { label: 'Esporta', click: async () => { this.MenuClickInterruptFn({ cmd: 'esporta' }) } },
      { label: 'Impostazioni', click: async () => { this.MenuClickInterruptFn({ cmd: 'settingsview' }) } },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac
        ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [
              { role: 'startSpeaking' },
              { role: 'stopSpeaking' }
            ]
          }
        ]
        : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ]
      )

    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
      // { label: 'Visualizza Template', click: async () => { this.MenuClickInterruptFn({ cmd: 'viewtemplate' }) } },
      //  { label: 'Visualizza Variabili', click: async () => { this.MenuClickInterruptFn({ cmd: 'variables' }) } },
      // { label: 'Cambia Tema', click: async () => { this.MenuClickInterruptFn({ cmd: 'switchtheme' }) } },
      // { label: 'Apri Preview Esterna', click: async () => { this.MenuClickInterruptFn({ cmd: 'externalpreviewopen' }) } },

    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac
        ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ]
        : [
          { role: 'close' }
        ])
    ]
  }
]
} 

}





module.exports = {
    BaseMenuContext
}