const router = require("express").Router();

// @GET /api/profile/test
// @desc Tests the profile route
// @access Public
router.get("/test", (req, res) =>
  res.json({ msg: "Heya you're on route /api/posts/test" })
);

module.exports = router;
