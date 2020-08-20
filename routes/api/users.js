const router = require("express").Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

//Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//Load User Model
const User = require("../../models/User");

//........................................................................................................................................//
// @GET /api/users/test
// @desc Tests the users route
// @access Public
router.get("/test", (req, res) =>
  res.json({ msg: "Heya you're on route /api/users/test" })
);
//........................................................................................................................................//

// Just checking out the user details sending their email in the request body.
router.get("/", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => res.json(user));
});

//........................................................................................................................................//
// @GET /api/users/register
// @desc Register User
// @access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password, name } = req.body;

  User.findOne({ email }).then((user) => {
    if (user) {
      errors.email = "Email is already in use";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(email, {
        s: "200", //Size
        r: "pg", //Rating
        d: "mm", //Default (No profile)
      });

      const newUser = new User({ email, password, name, avatar });

      //Here I'm encrypting the password and saving it back to the newUser object.

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;

          newUser.password = hash;

          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});
//........................................................................................................................................//

//........................................................................................................................................//
// @GET /api/users/login
// @desc Login User / Returning JWT Token
// @access Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  //Find the user by Email
  User.findOne({ email }).then((user) => {
    //Check for user existence
    if (!user) {
      errors.email = "Email hasn't been registered yet.";
      return res.status(400).json(errors);
    }

    //Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        //User Matched
        const payload = { id: user._id, name: user.name, avatar: user.avatar }; // <--- JWT Payload
        //Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            res.json({ success: true, token: `Bearer ${token}` });
          }
        );
      } else {
        errors.password = "Incorrect password";
        res.status(400).json(errors);
      }
    });
  });
});
//........................................................................................................................................//

//........................................................................................................................................//
// @GET /api/users/current
// @desc Current User / Whoever the token belongs to
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ id: req.user.id, name: req.user.name, email: req.user.email });
  }
);

//........................................................................................................................................//

module.exports = router;
