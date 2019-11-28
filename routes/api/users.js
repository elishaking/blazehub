const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const app = require('firebase/app');
require('firebase/database');

const sendInviteMail = require('./email');

const validateSignupData = require('../../validation/signup');
const validateSigninData = require('../../validation/signin');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSEGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};
const firebaseApp = app.initializeApp(firebaseConfig);

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

              // create default blazebot friend
              dbRef.child('friends').child(userKey).set({
                "blazebot": {
                  name: "BlazeBot",

                }
              }, (err) => {
                if (err) return console.error(err);

                dbRef.child('profiles').child(userKey)
                  .child('username').set(`${newUser.firstName}.${newUser.lastName}`.toLocaleLowerCase(), (err) => {
                    if (err) return console.log(err);

                    res.json({ success: true });
                  });
              });
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
      errors.signinEmail = "No user with this email, Please Sign Up";
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
          (err, token) => {
            // dbRef.child('tokens').child(userKey).set(token, (err) => {
            //   if (err) return console.error(err);


            // });
            return res.json({
              success: true,
              token: `Bearer ${token}`
            });
          }
        )
      } else {
        errors.signinPassword = 'Password incorrect';
        res.status(400).json(errors);
      }
    });
  })
});

//@route GET /api/users/
//@description Send All users
//@access Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  dbRef.child('users').limitToLast(30).once("value", (usersSnapshot) => res.json({
    users: usersSnapshot.val()
  }));
});

//@route GET /api/users/token
//@description Send Auth token
//@access Private
// router.get('/token', passport.authenticate('jwt', { session: false }), (req, res) => {
//   console.log(req.user.id);
//   dbRef.child('tokens').child(req.user.id).once("value", (userToken) => {
//     if (userToken.exists()) return res.json({ token: userToken.val() });

//     res.json({ token: null });
//   });
// });

//@route GET /api/users/firebase
//@description Send firebase credentials
//@access Private
router.get('/firebase', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(firebaseConfig);
});

//@route POST /api/users/friends
//@description Send all user friends
//@access Private
router.post('/friends', passport.authenticate('jwt', { session: false }), (req, res) => {
  dbRef.child('friends').child(req.body.userKey).once('value', (friendsSnapShot) => {
    res.json({ friends: friendsSnapShot.val() });
  });
});

//@route POST /api/users/friends/add
//@description Add a new friend
//@access Private
router.post('/friends/add', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { userKey, friendKey, friend } = req.body;

  // add new-friend to current-user's friends db
  dbRef.child('friends').child(userKey).child(friendKey).set(friend, (err) => {
    if (err) console.error(err);

    // add current-user to new-friend's db
    const user = req.user;
    dbRef.child('friends').child(friendKey).child(userKey).set({
      name: `${user.firstName} ${user.lastName}`
    }, (err) => {
      if (err) console.error(err);

      res.json({
        friend: {
          [friendKey]: friend
        }
      });
    });
  })
});

//@route POST /api/users/friends/invite
//@description Invite friends to Blazehub
//@access Private
router.post('/friends/invite', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const invitees = req.body;
  if (invitees[0].email == '') return res.status(400).json({ success: false });

  let success = true;
  for (let i = 0; i < invitees.length; i++) {
    success = await sendInviteMail(req.user, invitees[i].email) && success;
  }

  res.json({ success });
});

module.exports = router;
