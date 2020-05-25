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
    const userKey = generateUserKey(userEmail);

    try {
      const mailInfo = await sendConfirmationURL(userKey, userEmail);
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

        // user.confirmed may not exist for earlier users
        // if (user.confirmed === false) {
        //   return resolve(
        //     ResponseUtil.createResponse(
        //       false,
        //       403,
        //       "Authentication failed",
        //       "User is not verified"
        //     )
        //   );
        // }

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
                return generateJwtToken(jwtPayload);
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

const confirmUser = (token) =>
  new Promise(async (resolve) => {
    try {
      const userID = await validateToken(token);

      dbRef
        .child("users")
        .child(userID)
        .once("value")
        .then((userSnapshot) => {
          if (!userSnapshot.exists()) {
            return resolve(
              ResponseUtil.createResponse(
                false,
                403,
                "Confirmation failed",
                "User does not exist"
              )
            );
          }

          return userSnapshot.ref.child("confirmed").set(true);
        })
        .then(() => {
          resolve(ResponseUtil.createResponse(true, 200, "User confirmed"));
        })
        .catch((err) => {
          resolve(
            ResponseUtil.createResponse(false, 500, "Something went wrong")
          );
        });
    } catch (err) {
      resolve(
        ResponseUtil.createResponse(
          false,
          403,
          "Confirmation failed",
          "Invalid Confirmation URL"
        )
      );
    }
  });

/**
 * Resends user confirmation url to users email
 *
 * @param {string} email
 */
const resendConfirmationURL = (email) =>
  new Promise((resolve) => {
    const userKey = generateUserKey(email);
    dbRef
      .child("users")
      .child(userKey)
      .once("value")
      .then((userSnapshot) => {
        if (!userSnapshot.exists())
          return resolve(
            ResponseUtil.createResponse(
              false,
              403,
              "Failed",
              "You have not signed up yet, please sign up"
            )
          );

        if (userSnapshot.val().confirmed)
          return resolve(
            ResponseUtil.createResponse(
              false,
              403,
              "Failed",
              "Your account has already been confirmed"
            )
          );

        return sendConfirmationURL(userKey, email);
      })
      .then((info) => {
        console.log(info);

        resolve(
          ResponseUtil.createResponse(true, 200, "Confirmation URL Sent")
        );
      })
      .catch((err) => {
        console.log(err);

        resolve(
          ResponseUtil.createResponse(
            false,
            500,
            "Failed",
            "Something went wrong"
          )
        );
      });
  });

/**
 * Confirms the url sent for password reset
 *
 * @param {string} token
 */
const confirmPasswordResetURL = (token) =>
  new Promise(async (resolve) => {
    let userID;
    try {
      userID = await validateToken(token);
    } catch (err) {
      return resolve(
        ResponseUtil.createResponse(
          false,
          403,
          "Confirmation failed",
          "Password reset URL is invalid"
        )
      );
    }

    dbRef
      .child("users")
      .child(userID)
      .once("value")
      .then((userSnapshot) => {
        if (!userSnapshot.exists()) {
          return resolve(
            ResponseUtil.createResponse(
              false,
              403,
              "Confirmation failed",
              "Your account does not exist, please sign up"
            )
          );
        }

        resolve(
          ResponseUtil.createResponse(true, 200, "Password reset url confirmed")
        );
      })
      .catch((err) => {
        console.log(err);

        resolve(
          ResponseUtil.createResponse(false, 500, "Something went wrong")
        );
      });
  });

/**
 * Resets the users password
 *
 * @param {string} token
 * @param {string} password
 */
const resetPassword = (token, password) =>
  new Promise(async (resolve) => {
    let userID;
    try {
      userID = await validateToken(token);
    } catch (err) {
      return resolve(
        ResponseUtil.createResponse(
          false,
          403,
          "Password reset failed",
          "Password reset URL is invalid"
        )
      );
    }

    dbRef
      .child("users")
      .child(userID)
      .once("value")
      .then(async (userSnapshot) => {
        if (!userSnapshot.exists()) {
          return resolve(
            ResponseUtil.createResponse(
              false,
              403,
              "Password reset failed",
              "Your account does not exist, please sign up"
            )
          );
        }

        const hash = await generateHashedPassword(password);

        return userSnapshot.ref.child("password").set(hash);
      })
      .then(() => {
        redisClient.del(token);

        ResponseUtil.createResponse(
          true,
          200,
          "Password reset successful",
          "Your password has been reset"
        );
      })
      .catch((err) => {
        console.log(err);

        resolve(
          ResponseUtil.createResponse(false, 500, "Something went wrong")
        );
      });
  });

/**
 * Sends password reset url to users email
 *
 * @param {string} email
 */
const sendPasswordResetURL = (email) =>
  new Promise((resolve) => {
    const userKey = generateUserKey(email);
    dbRef
      .child("users")
      .child(userKey)
      .once("value")
      .then((userSnapshot) => {
        if (!userSnapshot.exists())
          return resolve(
            ResponseUtil.createResponse(
              false,
              403,
              "Failed",
              "You account does not exist, please sign up"
            )
          );

        return sendResetURL(userKey, email);
      })
      .then((info) => {
        console.log(info);

        resolve(
          ResponseUtil.createResponse(true, 200, "Password reset URL Sent")
        );
      })
      .catch((err) => {
        console.log(err);

        resolve(
          ResponseUtil.createResponse(
            false,
            500,
            "Failed",
            "Something went wrong"
          )
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
 * Send confirmation URL
 *
 * @param {string} userKey
 * @param {string} userEmail
 */
const sendConfirmationURL = async (userKey, userEmail) => {
  const confirmUrl = await generateUrl(userKey, "confirm");
  const message = generateMailMessage(
    "Almost Done, Confirm your Account",
    "Click on the link below to confirm your account. It expires in <strong>1 hour</strong>",
    confirmUrl,
    "Confirm account"
  );

  const mailInfo = await sendMail(
    "BlazeHub: Confirm your account",
    message,
    userEmail
  );

  return mailInfo;
};

/**
 * Send password reset URL
 *
 * @param {string} userKey
 * @param {string} userEmail
 */
const sendResetURL = async (userKey, userEmail) => {
  const resetUrl = await generateUrl(userKey, "password/reset");
  const message = generateMailMessage(
    "Reset your password",
    "Click on the link below to reset your password. It expires in <strong>1 hour</strong>",
    resetUrl,
    "Reset password"
  );

  const mailInfo = await sendMail(
    "BlazeHub: Reset your password",
    message,
    userEmail
  );

  return mailInfo;
};

/**
 * Generates user-key from email
 *
 * @param {string} email
 */
const generateUserKey = (email) =>
  email.replace(/\./g, "~").replace(/@/g, "~~");

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

/**
 * Checks if token exists
 *
 * @param {string} token
 */
const validateToken = (token) =>
  new Promise((resolve, reject) => {
    redisClient.get(token, (err, data) => {
      if (err) {
        console.log(err);
        return reject(err);
      }

      if (!data) {
        return reject(new Error("Token does not exist"));
      }

      resolve(data);
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
  confirmUser,
  resendConfirmationURL,
  sendPasswordResetURL,
  confirmPasswordResetURL,
  resetPassword,
  fetchUsers,
};
