const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } = require('firebase/firestore');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

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
const auth = getAuth(app);
async function getUserCountFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.size;
  } catch (error) {
    console.error('Error fetching user count from Firestore:', error);
    throw error; // Throw error so it can be caught in the handler below
  }
}

async function getClaimedRewardsCount() {
  try {
    const querySnapshot = await getDocs(collection(db, 'claimedRewards')); // Updated to 'claimedRewards'
    console.log(`Number of claimed rewards fetched: ${querySnapshot.size}`); // Log the count for debugging
    return querySnapshot.size;
  } catch (error) {
    console.error('Error fetching claimed rewards count:', error);
    return { error: 'Failed to fetch claimed rewards count' };
  }
}

async function getTotalBottleCount() {
  try {
    const querySnapshot = await getDocs(collection(db, 'userPoints'));
    let totalBottleCount = 0;
    querySnapshot.forEach(doc => {
      const data = doc.data();
      totalBottleCount += data.bottleCount;
    });
    return totalBottleCount;
  } catch (error) {
    console.error('Error fetching total bottle count:', error);
    return 0; // Return 0 on error to avoid disrupting the UI
  }
}

async function getDataFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data;
  } catch (error) {
    console.error('Error fetching Firestore data:', error);
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

// Function to update the status of a claimed reward in Firestore// Function to update the status of a claimed reward in Firestore
async function updateClaimedRewardStatus(rewardId, status, claimedAt) {
  try {
    const rewardDoc = doc(db, 'claimedRewards', rewardId);
    await updateDoc(rewardDoc, { status, claimedAt });
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

async function verifyRFID(rfidCode) {
  try {
    const q = query(collection(db, 'rfidCodes'), where('code', '==', rfidCode));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error verifying RFID code:', error);
    throw error;
  }
}

async function addUserPointToFirestore(user) {
  try {
    await addDoc(collection(db, 'userPoints'), user);
  } catch (error) {
    console.error('Error adding user points to Firestore:', error);
    throw error;
  }
}

async function getUserPointsFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, 'userPoints'));
    const userPoints = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return userPoints;
  } catch (error) {
    console.error('Error fetching user points from Firestore:', error);
    throw error;
  }
}

async function saveSale(quantity, totalWeight, price, dateOfSale) {
  try {
    await addDoc(collection(db, 'sales'), {
        quantity: quantity,
        totalWeight: totalWeight,
        price: price,
        dateOfSale: dateOfSale,
        total: quantity * price
    });
    console.log('Sale added successfully');
  } catch (error) {
    console.error('Error adding sale:', error);
    throw error;
  }
  }
  
  // Function to fetch sales data from Firestore
  async function fetchSales() {
  try {
    const querySnapshot = await getDocs(collection(db, 'sales'));
    const sales = querySnapshot.docs.map(doc => doc.data());
    return sales;
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw error;
  }
  }


module.exports = {
  getUserCountFromFirestore,
  getClaimedRewardsCount,
  getTotalBottleCount,

  getDataFromFirestore,
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

  auth,
  signInWithEmailAndPassword,
  verifyRFID,

  addUserPointToFirestore,
  getUserPointsFromFirestore,

  saveSale,
  fetchSales
};