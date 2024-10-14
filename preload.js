const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getData: () => ipcRenderer.invoke('get-data'),
  addUser: (user) => ipcRenderer.invoke('add-user', user),
  deleteUser: (userId) => ipcRenderer.invoke('delete-user', userId)
});
