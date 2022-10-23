// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage"; 
// import "firebase/storage"
import "firebase/compat/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDI7OLjwuqAeXiqb032B94G73QcryRKoi4",
  authDomain: "reels-app-cfc5d.firebaseapp.com",
  projectId: "reels-app-cfc5d",
  storageBucket: "reels-app-cfc5d.appspot.com",
  messagingSenderId: "1004786302222",
  appId: "1:1004786302222:web:432a130dbb3a22641feb5f"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

const firestore = firebase.firestore();
export const database = {
  users: firestore.collection("users"),
  posts: firestore.collection("posts"),
  comments:firestore.collection("comments"),
  getTimeStamp: firebase.firestore.FieldValue.serverTimestamp
};
// export const storage = firebase.storage();
// export const storage = firebase.storage();
export const storage = firebase.storage().ref;
