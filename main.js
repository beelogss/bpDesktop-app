const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Import electron-reload for live-reloading
require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
  
const { getDataFromFirestore, addUserToFirestore, deleteUserFromFirestore } = require('./main/firebase');

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
