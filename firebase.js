// Import the functions you need from the SDKs you need
//import * as firebase from "firebase";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


// Enable Firestore persistence


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTHd-zcpIrC04oqfszWnZ0YG7F-BiV_yM",
  authDomain: "fir-auth-15065.firebaseapp.com",
  projectId: "fir-auth-15065",
  storageBucket: "fir-auth-15065.appspot.com",
  messagingSenderId: "377171775219",
  appId: "1:377171775219:web:d6a9372ce0efa3b556f186",
  measurementId: "G-WEK3SFCJPT"
};



// Initialize Firebase
//const firebaseApp =firebase.initializeApp(firebaseConfig);
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

const auth = firebase.auth();
const db = firebase.firestore();
// Use these for db & auth
//const db = firebaseApp.firestore();
//const db = firebaseApp.firestore({
 //   experimentalForceLongPolling: true,
 //   useFetchStreams: false
//});
//const auth = firebase.auth();
const storage = firebase.storage();
export { auth, db, storage, firebase };
//export { auth, db , firebase};
