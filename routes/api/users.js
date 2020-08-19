const router = require("express").Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  const { email, password, name } = req.body;

  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).json({ error: "Email is already in use" });
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

module.exports = router;
