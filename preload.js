// preload.js

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  onMenuClearT0: (callback) => ipcRenderer.on('menu-clear-t0', (_event, value) => callback(value))
})
  