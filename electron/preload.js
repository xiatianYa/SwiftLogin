const { contextBridge, ipcRenderer }  = require('electron')
contextBridge.exposeInMainWorld('versions', {
  getVersions: (name) => {
    return process.versions[name]
  },
})
