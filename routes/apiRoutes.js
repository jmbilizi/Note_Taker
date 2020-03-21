const router = require("express").Router();
const Joi = require("joi");
const util = require("util");
const fs = require("fs");
const notes = require("../db/db.json");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

async function readFile() {
  const data = await readFileAsync("db/db.json", "UTF-8");
  return JSON.parse(data);
}

router.get("/notes", async (req, res) => {
  const data = await readFile();
  res.json(data);
});

//GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
router.post("/notes", async function(req, res) {
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
    writeFileAsync("db/db.json", JSON.stringify(data), "UTF-8");
  }
});

//delete route
router.delete("/notes/:id", async function(req, res) {
  var data = await readFile();
  let id = req.params.id;

  function deleteNote() {
    data = data.filter(note => note.id != id);
    writeFileAsync("db/db.json", JSON.stringify(data), "UTF-8");
    res.json(data);
  }
  deleteNote();
});

module.exports = router;
