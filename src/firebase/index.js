import firebase from 'firebase/app';
import 'firebase/storage';
import "firebase/database";
import "firebase/auth"


 // Initialize Firebase
 var config = {
    apiKey: "API KEY HERE", // To run this project, please provide an API key
    authDomain: "react-bro2bro.firebaseapp.com",
    databaseURL: "https://react-bro2bro.firebaseio.com",
    projectId: "react-bro2bro",
    storageBucket: "react-bro2bro.appspot.com",
    messagingSenderId: "ID provided by firebase..."
  };
  firebase.initializeApp(config);

  const storage = firebase.storage();

  export {
      storage, firebase as default
  }