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

async function addPetBottleToFirestore(petBottle) {
  try {
    await addDoc(collection(db, 'petBottles'), petBottle);
  } catch (error) {
    console.error('Error adding pet bottle to Firestore:', error);
    throw error;
  }
}

async function getPetBottlesFromFirestore() {
  try {
    const bottles = [];
    const snapshot = await getDocs(collection(db, 'petBottles'));
    snapshot.forEach(doc => {
      bottles.push({ id: doc.id, ...doc.data() });
    });
    return bottles;
  } catch (error) {
    console.error('Error fetching bottles:', error);
    throw error;
  }
}

async function editPetBottleInFirestore(petBottleId, brandName, size, sizeUnit, weight, weightUnit, barcodeNumber) {
  try {
    const petBottleRef = doc(db, 'petBottles', petBottleId);
    await updateDoc(petBottleRef, {
      brand_name: brandName,
      size: size,
      size_unit: sizeUnit,
      weight: weight,
      weight_unit: weightUnit,
      barcode_number: barcodeNumber,
    });
    console.log('Pet bottle successfully updated in Firebase!');
  } catch (error) {
    console.error('Error editing pet bottle in Firebase:', error);
    throw error;
  }
}

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

// Function to add a claimed reward to Firestore
async function addClaimedReward(reward) {
  try {
    const claimedRewardsCollection = collection(db, 'claimedRewards');
    const docRef = await addDoc(claimedRewardsCollection, reward);
    return docRef; // Return the document reference
  } catch (error) {
    console.error('Error adding claimed reward:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}

// Function to get all claimed rewards from Firestore
async function getClaimedRewards() {
  try {
    const claimedRewardsCollection = collection(db, 'claimedRewards');
    const claimedRewardsSnapshot = await getDocs(claimedRewardsCollection);

    const claimedRewards = claimedRewardsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return claimedRewards;
  } catch (error) {
    console.error('Error fetching claimed rewards:', error);
    return [];
  }
}

// Function to update the status of a claimed reward in Firestore
async function updateClaimedRewardStatus(rewardId, status) {
  try {
    const rewardDoc = doc(db, 'claimedRewards', rewardId);
    await updateDoc(rewardDoc, { status });
  } catch (error) {
    console.error('Error updating claimed reward status:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}

// Function to delete a claimed reward from Firestore
async function deleteClaimedReward(rewardId) {
  try {
    const rewardDoc = doc(db, 'claimedRewards', rewardId);
    await deleteDoc(rewardDoc);
  } catch (error) {
    console.error('Error deleting claimed reward:', error);
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
  deletePetBottleFromFirestore,

  addClaimedReward,
  getClaimedRewards,
  updateClaimedRewardStatus,
  deleteClaimedReward,
};