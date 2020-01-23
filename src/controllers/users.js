const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('firebase/app');
require('firebase/database');

const validateSignupData = require('../validation/signup');
const validateSigninData = require('../validation/signin');

const { createUser } = require('../services/users');
const ResponseUtil = require('../utils/response');

const dbRef = app.database().ref();

/**
 * Create a new user and redirect to signin page
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const signupUser = (req, res) => {
  createUser(req.body)
    .then((responseData) => ResponseUtil.sendResponse(
      res,
      responseData
    ));
};

/**
 * Authenticates a user and responds with a token
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const signinUser = (req, res) => {
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
      errors.signinEmail = "No user with this email, Please Sign Up";
      return res.status(400).json(errors);
    }

    const user = dataSnapshot.val();
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        app.database().ref('profiles').child(userKey).child('username')
          .once("value", (usernameSnapShot) => {
            // JWT payload
            const jwtPayload = {
              id: userKey,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              username: usernameSnapShot.val()
            };

            // Sign Token <==> encodes payload into token
            jwt.sign(
              jwtPayload,
              process.env.SECRET_OR_KEY,
              {
                expiresIn: 3600 * 24
              },
              (err, token) => {
                // dbRef.child('tokens').child(userKey).set(token, (err) => {
                //   if (err) return console.error(err);


                // });
                return res.json({
                  success: true,
                  token: `Bearer ${token}`
                });
              }
            );
          });
      } else {
        errors.signinPassword = 'Password incorrect';
        res.status(400).json(errors);
      }
    });
  });
};

/**
 * Get all Users
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const getUsers = (req, res) => {
  dbRef.child('users').limitToLast(30).once("value", (usersSnapshot) => res.json({
    users: usersSnapshot.val()
  }));
};

module.exports = {
  signupUser,
  signinUser,
  getUsers
};
