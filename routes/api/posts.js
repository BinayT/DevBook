const router = require("express").Router();

// @GET /api/posts/test
// @desc Tests the posts route
// @access Public
router.get("/test", (req, res) =>
  res.json({ msg: "Heya you're on route /api/posts/test" })
);

module.exports = router;
