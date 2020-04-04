const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const config = require("../config/database");

// Register
router.post("/register", (req, res) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });
  if (!newUser.email || !newUser.username || !newUser.password) {
    res.json({ success: false, msg: "Required fields are empty!!!" });
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) {
        console.log(err);
      } else {
        newUser.password = hash;
        newUser.save(err => {
          if (err) {
            res.json({ success: false, msg: "Failed to register user" });
          } else {
            res.json({ success: true, msg: "User registered" });
          }
        });
      }
    });
  });
});

// Authenticate
router.post("/authenticate", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  query = { username: username };
  User.findOne(query, (err, user) => {
    if (err) {
      console.log(err);
    }
    if (!user) {
      return res.json({ success: false, msg: "User not found" });
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.log(err);
      }
      if (isMatch) {
        // const token = jwt.sign({ exp: 604800, data: user }, config.secret);
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 604800
        });
        res.json({
          success: "true",
          token: "JWT " + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
      } else {
        res.json({ success: false, msg: "Wrong password" });
      }
    });
  });
});

// Profile
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let header = req.headers["authorization"];
    if (header) {
      let token = header.split(" ")[1];
      jwt.verify(token, config.secret, (err, user) => {
        if (err) {
          res.json({ success: false, msg: "Failed to authenticate token" });
        } else {
          res.json({ 
            success: true, 
            user: {
              name: user.name,
              username: user.username,
              email: user.email
            } });
        }
      });
    } else {
      res.json({ success: false, msg: "Token not provided" });
    }
    // console.log(header);
    // console.log("here");
    // console.log(req.user);
    // res.json({ user: req.user });
    // res.status(200).json({ user: req.user });
    // res.send("profile");
  }
);

module.exports = router;
