const express = require("express");
const mongoose = require("mongoose");

// -------------------------------------------Routes-------------------------------------------
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// -------------------------------------------Mongo URI-------------------------------------------
const mongoURI = require("./config/keys.js").mongoURI;

// -------------------------------------------Connect to MongoDB server-------------------------------------------
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () =>
  console.log("MongoDB database connection established successfully")
);

app.get("/", (req, res) => {
  res.send("Hello, We're about to get started!");
});

// -------------------------------------------Using Routes-------------------------------------------
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

app.listen(port, () => console.log(`Server running on port ${port}`));
