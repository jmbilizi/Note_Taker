// Dependencies
// =============================================================
const http = require("http");
const express = require("express");
const Joi = require("joi");
const fs = require("fs");
const path = require("path");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

//GET `/` - Should return the `index.html` file.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

async function readFile() {
  const data = await readFileAsync(__dirname + "/db/db.json", "UTF-8");
  return JSON.parse(data);
}

//GET `/notes` - Should return the `notes.html` file.
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", async (req, res) => {
  const data = await readFile();
  res.json(data);
});

//GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
app.post("/api/notes", async function(req, res) {
  const data = await readFile();
  let note = {
    id: data.length + 1,
    title: req.body.title,
    text: req.body.text
  };
  const schema = {
    title: Joi.string()
      .min(3)
      .required(),
    text: Joi.string()
      .min(5)
      .required()
  };

  const result = Joi.validate(req.body, schema);
  if (result.error) {
    res.send("Title must be 3 characters and text must be 5 characters");
  } else {
    data.push(note);

    writeFileAsync("./db/db.json", JSON.stringify(data), "UTF-8");
  }
});
//delete route
app.delete("/api/notes/:id", async function(req, res) {
  var data = await readFile();
  let id = req.params.id;

  function deleteNote() {
    data = data.filter(note => note.id != id);
    writeFileAsync("./db/db.json", JSON.stringify(data), "UTF-8");
    res.json(data);
  }
  deleteNote();
});

app.listen(PORT, () => {
  console.log("App listening on PORT " + PORT);
});
