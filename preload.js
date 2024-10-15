const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getData: () => ipcRenderer.invoke('get-data'),
  addUser: (user) => ipcRenderer.invoke('add-user', user),
  deleteUser: (userId) => ipcRenderer.invoke('delete-user', userId),
  uploadImage: (file) => ipcRenderer.invoke('upload-image', file),
  addReward: (reward) => ipcRenderer.invoke('add-reward', reward),
  getRewards: () => ipcRenderer.invoke('get-rewards'),
  editReward: (rewardId, rewardName, stock) => ipcRenderer.invoke('edit-reward', rewardId, rewardName, stock),
  deleteReward: (rewardId) => ipcRenderer.invoke('delete-reward', rewardId)
});