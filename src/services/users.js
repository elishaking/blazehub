const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const app = require("firebase/app");
require("firebase/database");

const { redisClient } = require("../config/redis");
const frontendConfig = require("../config/frontend");

const validateSignupData = require("../validation/signup");
const validateSigninData = require("../validation/signin");

const { generateMailMessage, sendMail } = require("./email");

const ResponseUtil = require("../utils/response");

const dbRef = app.database().ref();

/**
 * Creates a new user
 * @param {{email: string, firstName: string, lastName: string, password: string}} userData
 */
const createUser = (userData) =>
  new Promise(async (resolve) => {
    const { isValid, errors } = validateSignupData(userData);

    if (!isValid) {
      return resolve(
        ResponseUtil.createResponse(false, 400, "Could not create user", errors)
      );
    }

    const userEmail = userData.email;
    const userKey = userEmail.replace(/\./g, "~").replace(/@/g, "~~");

    const confirmUrl = await generateUrl(userKey, "confirm");
    const message = generateMailMessage(
      "Almost Done, Confirm your Account",
      "Click on the link below to confirm your account",
      confirmUrl,
      "Confirm account"
    );

    try {
      const mailInfo = await sendMail(
        "BlazeHub: Confirm your account",
        message,
        userEmail
      );
      console.log(mailInfo);
    } catch (err) {
      return resolve(
        ResponseUtil.createResponse(
          false,
          400,
          "Could not create user",
          err.message
        )
      );
    }

    const userRef = dbRef.child("users").child(userKey);
    userRef.once("value").then((dataSnapshot) => {
      if (dataSnapshot.exists()) {
        errors.email = "Email already exists";

        return resolve(
          ResponseUtil.createResponse(
            false,
            400,
            "Could not create user",
            errors
          )
        );
      }

      let newUsername = `${userData.firstName.replace(
        / /g,
        ""
      )}.${userData.lastName.replace(/ /g, "")}`.toLowerCase();

      const newUser = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        username: newUsername,
        password: "hash",
        confirmed: false,
      };

      generateHashedPassword(userData.password)
        .then((hash) => {
          newUser.password = hash;

          return dbRef
            .child("users")
            .orderByChild("username")
            .equalTo(newUsername)
            .limitToFirst(1)
            .once("value");
        })
        .then((userSnapShot) => {
          if (userSnapShot.exists())
            newUsername = `${newUsername}_${Date.now()}`;

          return userRef.set(newUser);
        })
        .then(() => {
          // create default blazebot friend
          const data = {
            blazebot: {
              name: "BlazeBot",
            },
          };
          return dbRef.child("friends").child(userKey).set(data);
        })
        .then(() => {
          return dbRef
            .child("profiles")
            .child(userKey)
            .child("username")
            .set(newUsername);
        })
        .then(() => {
          resolve(ResponseUtil.createResponse(true, 200, "User created"));
        })
        .catch((err) => console.log(err));
    });
  });

/**
 * Authenticates existing user
 * @param {{email: string, password: string}} userData
 */
const authenticateUser = (userData) =>
  new Promise((resolve) => {
    const { isValid, errors } = validateSigninData(userData);

    if (!isValid) {
      return resolve(
        ResponseUtil.createResponse(false, 400, "Authentication failed", errors)
      );
    }

    const email = userData.email;
    const password = userData.password;

    const userKey = email.replace(/\./g, "~").replace(/@/g, "~~");
    const userRef = dbRef.child("users").child(userKey);

    userRef
      .once("value")
      .then((dataSnapshot) => {
        if (!dataSnapshot.exists()) {
          errors.signinEmail = "No user with this email, Please Sign Up";

          return resolve(
            ResponseUtil.createResponse(
              false,
              400,
              "Authentication failed",
              errors
            )
          );
        }

        const user = dataSnapshot.val();
        bcrypt.compare(password, user.password).then((isMatch) => {
          if (isMatch) {
            app
              .database()
              .ref("profiles")
              .child(userKey)
              .child("username")
              .once("value")
              .then((usernameSnapShot) => {
                // JWT payload
                const jwtPayload = {
                  id: userKey,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  username: usernameSnapShot.val(),
                };

                // Sign Token <==> encodes payload into token
                return generateJwtToken();
              })
              .then((token) => {
                resolve(
                  ResponseUtil.createResponse(
                    true,
                    200,
                    "User Authenticated",
                    `Bearer ${token}`
                  )
                );
              })
              .catch((err) => {
                resolve(
                  ResponseUtil.createResponse(
                    false,
                    400,
                    "Could not authenticate user",
                    err.message
                  )
                );
              });
          } else {
            errors.signinPassword = "Password incorrect";

            resolve(
              ResponseUtil.createResponse(
                false,
                400,
                "Could not authenticate user",
                errors
              )
            );
          }
        });
      })
      .catch((err) => {
        console.log(err);

        resolve(
          ResponseUtil.createResponse(false, 500, "Authentication Failed")
        );
      });
  });

/**
 * Fetchs users from firebase
 */
const fetchUsers = () =>
  new Promise((resolve) => {
    dbRef
      .child("users")
      .limitToLast(30)
      .once("value")
      .then((usersSnapshot) => {
        const usersExist = usersSnapshot.exists();
        const data = usersExist ? usersSnapshot.val() : undefined;

        resolve(
          ResponseUtil.createResponse(
            true,
            200,
            usersExist ? "Found users" : "No users found",
            data
          )
        );
      })
      .catch((err) => {
        console.log(err);

        resolve(
          ResponseUtil.createResponse(false, 500, "Could not fetch users")
        );
      });
  });

/**
 * Hash password
 * @param {string} password
 */
const generateHashedPassword = (password) =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.log(err);
        return reject(err);
      }

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          console.log(err);
          return reject(err);
        }

        resolve(hash);
      });
    });
  });

/**
 * Generates token url
 *
 * @param {string} userID
 * @param {string} route
 */
const generateUrl = (userID, route) =>
  new Promise((resolve, reject) => {
    const token = crypto.randomBytes(64).toString("hex");
    redisClient.set(token, userID, "EX", 60 * 60, (err, reply) => {
      if (err) return reject(err);

      resolve(`${frontendConfig.url}/${route}/${token}`);
    });
  });

const generateJwtToken = (jwtPayload) =>
  new Promise((resolve, reject) => {
    jwt.sign(
      jwtPayload,
      process.env.SECRET_OR_KEY,
      {
        expiresIn: 3600 * 24,
      },
      (err, token) => {
        if (err) {
          console.log(err);
          return reject(err);
        }

        resolve(token);
      }
    );
  });

module.exports = {
  createUser,
  authenticateUser,
  fetchUsers,
};
