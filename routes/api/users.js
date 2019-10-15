const router = require('express').Router();
const bcrypt = require('bcryptjs');
const firebase = require('firebase');
require('firebase/database');

const validateSignupData = require('../../validation/signup');

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

// @route POST api/users/signup
// @description Register new user
// @access Public
router.post("/signup", (req, res) => {
  const { isValid, errors } = validateSignupData(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const userEmail = req.body.email;
  const userKey = userEmail.replace(/\./g, "~").replace(/@/g, "~~");

  const usersRef = dbRef.child('users');
  usersRef
    .once(userKey, (err) => {
      if (err) {
        console.error(err);
        res.send("error");
      }
    });
  // usersRef
  //   .child(userKey)
  //   .set(userEmail, (err) => {
  //     if (err) {
  //       errors.email = "Email already exists";
  //       return res.status(400).json(errors);
  //     }

  //     bcrypt.genSalt(10, (err, salt) => {
  //       if (err) console.error(err);
  //       bcrypt.hash(req.body.password, salt, (err, hash) => {
  //         if (err) console.error(err);
  //       });
  //     });
  //   })
});

module.exports = router;
