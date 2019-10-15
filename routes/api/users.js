const router = require('express').Router();
const bcrypt = require('bcryptjs');
const firebase = require('firebase');
require('firebase/database');

const firebaseApp = firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSEGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
});

const dbRef = firebaseApp.database().ref();

// @route POST api/users/register
// @description Register new user
// @access Public
router.post("/signup", (req, res) => {

});
