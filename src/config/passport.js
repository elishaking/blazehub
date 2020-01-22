const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const app = require('firebase/app');
require('firebase/database');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_OR_KEY;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwtPayload, done) => {
      app.database().ref('users').child(jwtPayload.id).once('value', (userSnapShot) => {
        if (userSnapShot.exists()) {
          return done(null, userSnapShot.val());
        }
        return done(null, false);
      }).catch((err) => console.log(err));
    })
  );
};
