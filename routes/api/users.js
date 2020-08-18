const router = require("express").Router();

// @GET /api/users/test
// @desc Tests the users route
// @access Public
router.get("/test", (req, res) =>
  res.json({ msg: "Heya you're on route /api/users/test" })
);

module.exports = router;
