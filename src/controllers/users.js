const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const app = require('firebase/app');
require('firebase/database');

const sendInviteMail = require('../utils/email');

const validateSignupData = require('../validation/signup');
const validateSigninData = require('../validation/signin');

const firebaseConfig = require('../config/firebase');
const firebaseApp = app.initializeApp(firebaseConfig);

const dbRef = firebaseApp.database().ref();

/**
 * Create a new user and redirect to signin page
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const signupUser = (req, res) => {
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

              // create default blazebot friend
              dbRef.child('friends').child(userKey).set({
                "blazebot": {
                  name: "BlazeBot",

                }
              }, (err) => {
                if (err) return console.error(err);

                dbRef.child('profiles').child(userKey)
                  .child('username').set(`${newUser.firstName.replace(/ /g, "")}.${newUser.lastName.replace(/ /g, "")}`.toLowerCase(), (err) => {
                    if (err) return console.log(err);

                    res.json({ success: true });
                  });
              });
            });
        });
      });
    });
};

module.exports = {
  signupUser
};
