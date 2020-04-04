const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");

// Connect to Database
const config = require("./config/database");
mongoose.connect(config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// On Connection
mongoose.connection.on("connected", () => {
  console.log(`Connected to database ${config.database}!!!`);
});

// On Error
mongoose.connection.on("error", err => {
  console.log(`Database connection error: ${err}`);
});

// Initialize app
const app = express();

// Cors Middleware
app.use(cors());

// Body Parser Middle ware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

// Routes
const users = require("./routes/users");
app.use("/users", users);

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Index Route
app.get("/", (req, res) => {
  res.send("Invalid Endpoint");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Port Number
// const port = 3000;
const port = process.env.PORT || 8080;

// Start Server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
