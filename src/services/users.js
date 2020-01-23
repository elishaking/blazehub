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

module.exports = {
  createUser
};
