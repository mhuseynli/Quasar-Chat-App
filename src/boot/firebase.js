// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from 'firebase/app';

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/database");

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCualK1uiNigtsCDivM7WSZoYAE0cyHCXU",
  authDomain: "simplechat-3cc95.firebaseapp.com",
  projectId: "simplechat-3cc95",
  storageBucket: "simplechat-3cc95.appspot.com",
  messagingSenderId: "2750150158",
  appId: "1:2750150158:web:6bbeab7c4a322c58916e5f"
};
// Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig);
let firebaseAuth = firebaseApp.auth();
let firebaseDb = firebaseApp.database();

export { firebaseAuth, firebaseDb }