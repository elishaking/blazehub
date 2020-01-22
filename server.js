const express = require('express');
const helmet = require('helmet');
const dotenv = require('dotenv');
const passport = require('passport');

const server = express();

// load environment variables
dotenv.config();

server.use(helmet());

const app = require('firebase/app');

const firebaseConfig = require('./src/config/firebase');
app.initializeApp(firebaseConfig);

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use((req, res, next) => {
  console.log(`${Date().split(" ")[4]}: ${req.method} Request: ${req.originalUrl}`);
  next();
});

server.get("/", (req, res) => {
  res.send("Welcome");
});

//Passport Middleware
server.use(passport.initialize());

//Passport Config
const passportConfig = require('./src/config/passport');
passportConfig(passport);

const users = require('./src/routes/api/users');
const friends = require('./src/routes/api/friends');

server.use("/api/users", users);
server.use("/api/friends", friends);

server.listen(process.env.PORT, () => {
  console.log("Server online");
});
