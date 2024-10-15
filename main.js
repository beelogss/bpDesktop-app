const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
});
const { getDataFromFirestore, addUserToFirestore, deleteUserFromFirestore, uploadImage, addRewardToFirestore, getRewardsFromFirestore } = require('./main/firebase');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadFile('renderer/index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('get-data', async () => {
  try {
    const data = await getDataFromFirestore();
    console.log('Data sent to renderer:', data);
    return data;
  } catch (error) {
    console.error('Error fetching Firestore data:', error);
    return { error: 'Failed to fetch data' };
  }
});

ipcMain.handle('add-user', async (event, user) => {
  try {
    await addUserToFirestore(user);
    return { success: true };
  } catch (error) {
    console.error('Error adding user:', error);
    return { error: 'Failed to add user' };
  }
});

ipcMain.handle('delete-user', async (event, userId) => {
  try {
    await deleteUserFromFirestore(userId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { error: 'Failed to delete user' };
  }
});

ipcMain.handle('upload-image', async (event, file) => {
  try {
    const imageUrl = await uploadImage(file);
    return { success: true, imageUrl };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { error: 'Failed to upload image' };
  }
});

ipcMain.handle('add-reward', async (event, reward) => {
  try {
    await addRewardToFirestore(reward);
    return { success: true };
  } catch (error) {
    console.error('Error adding reward:', error);
    return { error: 'Failed to add reward' };
  }
});

ipcMain.handle('get-rewards', async () => {
  try {
    const rewards = await getRewardsFromFirestore();
    return rewards;
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return { error: 'Failed to fetch rewards' };
  }
});