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
    res.status(404).send(result.error.details[0].message);
    return;
  } else {
    data.push(note);

    writeFileAsync("./db/db.json", JSON.stringify(data), "UTF-8");
  }
});

app.delete("/api/notes/:id", async function(req, res) {

  const data = await readFile();
  let id = req.params.id;

  function deleteNote(id) {
    return data.then(
      data.filter(item => {
        fileredNotes = item.id !== parseInt(id);
        console.log(fileredNotes);
        fs.writeFileAsync("./db/db.json", JSON.stringify(filteredNotes), "UTF-8");
      })
    );
  }
  deleteNote(id);
});

// app.delete("/api/notes", async function(req, res) {
//   let note = {
//     title: req.body.title,
//     text: req.body.text
//   };

//   const data = await readFile();

//   data.push(note);

//   console.log(data);

//   writeFileAsync("./db/db.json", JSON.stringify(data), "UTF-8");
//   res.end();
// });

//start the server
app.listen(PORT, () => {
  console.log("App listening on PORT " + PORT);
});
