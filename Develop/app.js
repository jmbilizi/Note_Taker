// Dependencies
// =============================================================
const http = require("http");
const express = require("express");
const fs = require("fs");
const path = require("path");

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//GET `/` - Should return the `index.html` file.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

//GET `/notes` - Should return the `notes.html` file.
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//start the server
app.listen(PORT, () => {
  console.log("App listening on PORT " + PORT);
});
