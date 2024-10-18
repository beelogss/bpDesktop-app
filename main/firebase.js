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

// Edit user data in Firestore
async function editUserFromFirestore(userId, studentNumber, name, email) {
  try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
          studentNumber: studentNumber,
          name: name,
          email: email
      });
      console.log('User successfully updated in Firebase!');
  } catch (error) {
      console.error('Error editing user in Firebase:', error);
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

async function editRewardFromFirestore(rewardId, rewardName, stock, points) {
  try {
    const rewardRef = doc(db, 'rewards', rewardId);
    await updateDoc(rewardRef, {
      reward_name: rewardName,
      stock: stock,
      points: points
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

// Function to upload an image for a pet bottle
async function uploadPetBottleImage(fileBuffer, fileName) {
  try {
    const storageRef = ref(storage, `petBottles/${fileName}`);
    const snapshot = await uploadBytes(storageRef, fileBuffer);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Pet bottle image uploaded successfully:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading pet bottle image:', error);
    throw error;
  }
}

// Function to add a pet bottle to Firestore
async function addPetBottleToFirestore(petBottle) {
  try {
    await addDoc(collection(db, 'petBottles'), petBottle);
  } catch (error) {
    console.error('Error adding pet bottle to Firestore:', error);
    throw error;
  }
}

// Function to retrieve all pet bottles from Firestore
async function getPetBottlesFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, 'petBottles'));
    const petBottles = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return petBottles;
  } catch (error) {
    console.error('Error fetching pet bottles from Firestore:', error);
    throw error;
  }
}

// Function to edit a pet bottle in Firestore
async function editPetBottleInFirestore(petBottleId, brandName, size, weight, barcodeNumber) {
  try {
    const petBottleRef = doc(db, 'petBottles', petBottleId);
    await updateDoc(petBottleRef, {
      brand_name: brandName,
      size: size,
      weight: weight,
      barcode_number: barcodeNumber
    });
    console.log('Pet bottle successfully updated in Firestore!');
  } catch (error) {
    console.error('Error editing pet bottle in Firestore:', error);
    throw error;
  }
}

// Function to delete a pet bottle from Firestore
async function deletePetBottleFromFirestore(petBottleId) {
  try {
    const petBottleRef = doc(db, 'petBottles', petBottleId);
    await deleteDoc(petBottleRef);
    console.log('Pet bottle successfully deleted from Firestore!');
  } catch (error) {
    console.error('Error deleting pet bottle from Firestore:', error);
    throw error;
  }
}



module.exports = { 
  getDataFromFirestore, 
  addUserToFirestore,
  editUserFromFirestore, 
  deleteUserFromFirestore, 

  uploadImage, 
  addRewardToFirestore, 
  getRewardsFromFirestore, 
  editRewardFromFirestore,
  deleteRewardFromFirestore,

  uploadPetBottleImage,
  addPetBottleToFirestore,
  getPetBottlesFromFirestore,
  editPetBottleInFirestore,
  deletePetBottleFromFirestore
};