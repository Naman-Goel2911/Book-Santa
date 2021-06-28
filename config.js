import * as firebase from 'firebase'

require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyDX9N4zVry2aVOVL3t6-m_bg9Ri4CSJZNA",
    authDomain: "book-santa-43713.firebaseapp.com",
    projectId: "book-santa-43713",
    storageBucket: "book-santa-43713.appspot.com",
    messagingSenderId: "401347626198",
    appId: "1:401347626198:web:2a4186bbdcc001c6e1b577"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();