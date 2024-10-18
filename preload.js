const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getData: () => ipcRenderer.invoke('get-data'),
  addUser: (user) => ipcRenderer.invoke('add-user', user),
  editUser: (userId, studentNumber, name, email) => ipcRenderer.invoke('edit-user', userId, studentNumber, name, email),
  deleteUser: (userId) => ipcRenderer.invoke('delete-user', userId),

  uploadImage: (file) => ipcRenderer.invoke('upload-image', file),
  addReward: (reward) => ipcRenderer.invoke('add-reward', reward),
  getRewards: () => ipcRenderer.invoke('get-rewards'),
  editReward: (rewardId, rewardName, stock, points) => ipcRenderer.invoke('edit-reward', rewardId, rewardName, stock, points),
  deleteReward: (rewardId) => ipcRenderer.invoke('delete-reward', rewardId),

  uploadPetBottleImage: (file) => ipcRenderer.invoke('upload-pet-bottle-image', file),
  addPetBottle: (petBottle) => ipcRenderer.invoke('add-pet-bottle', petBottle),
  getPetBottles: () => ipcRenderer.invoke('get-pet-bottles'),
  editPetBottle: (petBottleId, brandName, size, sizeUnit, weight, weightUnit, barcodeNumber, imageUrl) => ipcRenderer.invoke('edit-pet-bottle', petBottleId, brandName, size, sizeUnit, weight, weightUnit, barcodeNumber, imageUrl),
  deletePetBottle: (petBottleId) => ipcRenderer.invoke('delete-pet-bottle', petBottleId),

});
