const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, We're about to get started!");
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
