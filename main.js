const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
});
const { getDataFromFirestore, addUserToFirestore, editUserFromFirestore, deleteUserFromFirestore, uploadImage, addRewardToFirestore, getRewardsFromFirestore, editRewardFromFirestore, deleteRewardFromFirestore} = require('./main/firebase');

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
    minWidth: 800,
    minHeight: 600
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

ipcMain.handle('edit-user', async (event, userId, studentNumber, name, email) => {
  try {
      await editUserFromFirestore(userId, studentNumber, name, email);
      return { success: true };
  } catch (error) {
      console.error('Error editing user:', error);
      return { error: 'Failed to edit user' };
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

ipcMain.handle('upload-image', async (event, { fileContent, fileName }) => {
  try {
    const imageUrl = await uploadImage(Buffer.from(fileContent), fileName);
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

ipcMain.handle('edit-reward', async (event, rewardId, rewardName, stock, points) => {
  try {
    await editRewardFromFirestore(rewardId, rewardName, stock, points); // Update Firebase with the new reward details
    return { success: true };
  } catch (error) {
    console.error('Error editing reward in main.js:', error);
    return { success: false, error: error.message };
  }
});


ipcMain.handle('delete-reward', async (event, id) => {
  try {
      await deleteRewardFromFirestore(id); // Call Firebase delete function
      return { success: true };
  } catch (error) {
      console.error('Error deleting reward:', error);
      return { success: false, error };
  }
});
