const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } = require('firebase/firestore');

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

module.exports = { getDataFromFirestore, addUserToFirestore, deleteUserFromFirestore };
