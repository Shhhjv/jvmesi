import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/analytics";
import 'firebase/compat/database'
const fireConfig = {
    apiKey: "AIzaSyAgZ45eTB-n2henGrNFSw3GrkY7rcLNPmk",
    authDomain: "jvmesi-c9d12.firebaseapp.com",
    projectId: "jvmesi-c9d12",
    storageBucket: "jvmesi-c9d12.appspot.com",
    messagingSenderId: "300533251986",
    appId: "1:300533251986:web:714388763639d56a200b4b"
}

// if a Firebase instance doesn't exist, create one
if (!firebase.apps.length) {
    firebase.initializeApp(fireConfig)
    
}

export default firebase;
