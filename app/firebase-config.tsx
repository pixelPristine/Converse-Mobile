// Import necessary modules from React Native
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// Import Firebase modules
// import database, { firebase } from '@react-native-firebase/firestore';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCgOzJif4fV5bLvJdl7wlDW2sY0itLNxiE",
    authDomain: "converse-b4168.firebaseapp.com",
    projectId: "converse-b4168",
    storageBucket: "converse-b4168.appspot.com",
    messagingSenderId: "1069360082542",
    appId: "1:1069360082542:web:188a737e14354acd8f407f",
    measurementId: "G-7LC8WB51PN"
  };

  const app = initializeApp(firebaseConfig);


 export const db = getFirestore(app);