const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
const config = require("../config/database");

module.exports = passport => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("JWT");
  opts.secretOrKey = config.secret;
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      // console.log(jwt_payload._id);
      User.findOne({ id: jwt_payload.sub }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
          // or you could create a new account
        }
      });
    })
  );
  // passport.use(
  //   new JwtStrategy(opts, (jwt_payload, done) => {
  //     User.findOne({ id: jwt_payload.sub }, (err, user) => {
  //       if (err) {
  //         return done(err, false);
  //       }
  //       if (user) {
  //         return done(null, user);
  //       } else {
  //         return done(null, false);
  //       }
  //     });
  //   })
  // );
};
