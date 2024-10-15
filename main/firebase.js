const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } = require('firebase/firestore');
const { getStorage, ref, uploadBytes, getDownloadURL} = require('firebase/storage');

const firebaseConfig = {
    apiKey: "AIzaSyCNBtOJqXJXiSbEZLO83DJ1oq2etkKUbI4",
    authDomain: "bpts-34c54.firebaseapp.com",
    projectId: "bpts-34c54",
    storageBucket: "bpts-34c54.appspot.com",
    messagingSenderId: "320960896346",
    appId: "1:320960896346:web:7cb35f9324c9c2d7a7a763",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

async function getDataFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Firestore Data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching Firestore data:', error);
    throw error;
  }
}

async function addUserToFirestore(user) {
  try {
    await addDoc(collection(db, 'users'), user);
  } catch (error) {
    console.error('Error adding user to Firestore:', error);
    throw error;
  }
}

async function deleteUserFromFirestore(userId) {
  try {
    await deleteDoc(doc(db, 'users', userId));
  } catch (error) {
    console.error('Error deleting user from Firestore:', error);
    throw error;
  }
}

async function uploadImage(fileBuffer, fileName) {
  try {
    const storageRef = ref(storage, `rewards/${fileName}`);
    const snapshot = await uploadBytes(storageRef, fileBuffer);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Image uploaded successfully:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

async function addRewardToFirestore(reward) {
  try {
    await addDoc(collection(db, 'rewards'), reward);
  } catch (error) {
    console.error('Error adding reward to Firestore:', error);
    throw error;
  }
}

async function getRewardsFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, 'rewards'));
    const rewards = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return rewards;
  } catch (error) {
    console.error('Error fetching rewards from Firestore:', error);
    throw error;
  }
}

async function editRewardFromFirestore(rewardId, rewardName, stock) {
  try {
    const rewardRef = doc(db, 'rewards', rewardId);
    await updateDoc(rewardRef, {
      reward_name: rewardName,
      stock: stock
    });
    console.log('Reward successfully updated in Firebase!');
  } catch (error) {
    console.error('Error editing reward in Firebase:', error);
    throw error;
  }
}

async function deleteRewardFromFirestore(rewardId) {
  try {
    const rewardRef = doc(db, 'rewards', rewardId);
    await deleteDoc(rewardRef);
    console.log('Reward successfully deleted from Firebase!');
  } catch (error) {
    console.error('Error deleting reward from Firebase:', error);
    throw error;
  }
}

module.exports = { 
  getDataFromFirestore, 
  addUserToFirestore, 
  deleteUserFromFirestore, 
  uploadImage, 
  addRewardToFirestore, 
  getRewardsFromFirestore, 
  deleteRewardFromFirestore,
  editRewardFromFirestore
};