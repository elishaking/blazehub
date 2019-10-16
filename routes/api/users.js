const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const firebase = require('firebase');
require('firebase/database');

const validateSignupData = require('../../validation/signup');
const validateSigninData = require('../../validation/signin');

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

  const userRef = dbRef.child('users').child(userKey);
  userRef
    .once('value', (dataSnapshot) => {
      if (dataSnapshot.exists()) {
        errors.email = "Email already exists";
        return res.status(400).json(errors);
      }

      bcrypt.genSalt(10, (err, salt) => {
        if (err) console.error(err);
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) return console.error(err);

          const newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
          }
          userRef
            .set(newUser, (err) => {
              if (err) return console.error(err);

              res.json({ success: true });
            });
        });
      });
    });
});

//@route POST /api/users/signin
//@description Authenticate user
//@access Public
router.post('/signin', (req, res) => {
  const { isValid, errors } = validateSigninData(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  const userKey = email.replace(/\./g, "~").replace(/@/g, "~~");
  const userRef = dbRef.child('users').child(userKey);

  userRef.once('value', (dataSnapshot) => {
    if (!dataSnapshot.exists()) {
      errors.email = "No user with this email, Please Sign Up";
      return res.status(400).json(errors);
    }

    const user = dataSnapshot.val();
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // JWT payload
        const jwtPayload = {
          id: userKey,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        };

        // Sign Token <==> encodes payload into token
        jwt.sign(
          jwtPayload,
          process.env.SECRET_OR_KEY,
          {
            expiresIn: 3600 * 24
          },
          (err, token) => res.json({
            success: true,
            token: `Bearer ${token}`
          })
        )
      } else {
        errors.password = 'Password incorrect';
        res.status(400).json(errors);
      }
    });
  })
});

module.exports = router;
