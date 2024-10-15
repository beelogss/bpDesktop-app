const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } = require('firebase/firestore');
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage');

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
async function uploadImageToStorage(file, fileName) {
  try {
      const storageRef = ref(storage, `rewards/${fileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;  // Return the image URL
  } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
  }
}



async function getRewardsFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, 'rewards'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data;
  } catch (error) {
    console.error('Error fetching Firestore rewards data:', error);
    throw error;
  }
}
// Function to add a reward along with an image to Firestore
async function addrewardToFirestore(reward, imageFile) {
  try {
      // Upload the image to Firebase Storage
      const imageUrl = await uploadImageToStorage(imageFile, reward.reward_name);

      // Add the reward to Firestore along with the image URL
      const rewardData = {
          ...reward,
          image_url: imageUrl,  // Include the image URL in the reward data
      };
      await addDoc(collection(db, 'rewards'), rewardData);

      console.log('Reward added with image URL:', imageUrl);
  } catch (error) {
      console.error('Error adding reward to Firestore:', error);
      throw error;
  }
}

// Fetch rewards from Firestore
async function getRewardsFromFirestore() {
try {
  const querySnapshot = await getDocs(collection(db, 'rewards'));
  const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log('Firestore Rewards Data:', data);
  return data;
} catch (error) {
  console.error('Error fetching Firestore rewards data:', error);
  throw error;
}
}

// Delete reward from Firestore and remove the image from Firebase Storage
async function deleterewardFromFirestore(rewardId, imageUrl) {
  try {
      // Delete reward from Firestore
      await deleteDoc(doc(db, 'rewards', rewardId));

      // Delete the image from Firebase Storage
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);

      console.log('Reward and associated image deleted successfully');
  } catch (error) {
      console.error('Error deleting reward from Firestore:', error);
      throw error;
  }
}
module.exports = { 
  getDataFromFirestore, 
  addUserToFirestore, 
  deleteUserFromFirestore,
  uploadImageToStorage,
  addrewardToFirestore,
  getRewardsFromFirestore,
  deleterewardFromFirestore
};
