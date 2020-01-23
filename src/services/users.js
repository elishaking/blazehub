const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('firebase/app');
require('firebase/database');

const validateSignupData = require('../validation/signup');
const validateSigninData = require('../validation/signin');

const ResponseUtil = require('../utils/response');

const dbRef = app.database().ref();

/**
 * 
 * @param {{email: string, firstName: string, lastName: string, password: string}} userData
 */
const createUser = (userData) => new Promise((resolve) => {
  const { isValid, errors } = validateSignupData(userData);

  if (!isValid) {
    resolve(ResponseUtil.createResponse(
      false,
      400,
      "Could not create user",
      errors
    ));
  }

  const userEmail = userData.email;
  const userKey = userEmail.replace(/\./g, "~").replace(/@/g, "~~");

  const userRef = dbRef.child('users').child(userKey);
  userRef.once('value')
    .then((dataSnapshot) => {
      if (dataSnapshot.exists()) {
        errors.email = "Email already exists";
        resolve(ResponseUtil.createResponse(
          false,
          400,
          "Could not create user",
          errors
        ));
      }

      bcrypt.genSalt(10, (err, salt) => {
        if (err) console.log(err);

        bcrypt.hash(userData.password, salt, (err, hash) => {
          if (err) return console.log(err);

          const newUser = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: hash,
          }
          userRef.set(newUser)
            .then(() => {
              // create default blazebot friend
              const data = {
                "blazebot": {
                  name: "BlazeBot",

                }
              };
              dbRef.child('friends').child(userKey).set(data)
                .then(() => {
                  const username = `${newUser.firstName.replace(/ /g, "")}.${newUser.lastName.replace(/ /g, "")}`
                    .toLowerCase();

                  dbRef.child('profiles').child(userKey).child('username').set(username)
                    .then(() => {
                      resolve(ResponseUtil.createResponse(
                        true,
                        200,
                        "User created"
                      ));
                    })
                    .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        });
      });
    });
});

/**
 * 
 * @param {{email: string, password: string}} userData
 */
const authenticateUser = (userData) => new Promise((resolve) => {
  const { isValid, errors } = validateSigninData(userData);

  if (!isValid) {
    resolve(ResponseUtil.createResponse(
      false,
      400,
      "Could not authenticate user",
      errors
    ));
  }

  const email = userData.email;
  const password = userData.password;

  const userKey = email.replace(/\./g, "~").replace(/@/g, "~~");
  const userRef = dbRef.child('users').child(userKey);

  userRef.once('value', (dataSnapshot) => {
    if (!dataSnapshot.exists()) {
      errors.signinEmail = "No user with this email, Please Sign Up";
      resolve(ResponseUtil.createResponse(
        false,
        400,
        "Could not authenticate user",
        errors
      ));
    }

    const user = dataSnapshot.val();
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        app.database().ref('profiles').child(userKey).child('username').once("value")
          .then((usernameSnapShot) => {
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
                if (err) {
                  console.log(err);
                }

                resolve(ResponseUtil.createResponse(
                  true,
                  200,
                  "User Authenticated",
                  `Bearer ${token}`
                ));
              }
            );
          });
      } else {
        errors.signinPassword = 'Password incorrect';

        resolve(ResponseUtil.createResponse(
          false,
          400,
          "Could not authenticate user",
          errors
        ));
      }
    });
  });
});

module.exports = {
  createUser,
  authenticateUser
};
