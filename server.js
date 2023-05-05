const express = require("express");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// getting notes
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

// reads the db.json file
app.get("/api/notes", function (req, res) {
  fs.readFile("./db/db.json", (err, data) => res.send(data));
});

// function to read notes from the json file
const readNotes = (callback) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    callback(notes);
  });
};

// function to write notes to the json file
const writeNotes = (notes, callback) => {
  fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
    if (err) throw err;
    callback();
  });
};

// route to create a new note and save it to the json file
app.post("/api/notes", (req, res) => {
  readNotes((notes) => {
    const newNote = {
      title: req.body.title,
      text: req.body.text,
      id: uniqid(),
    };
    notes.push(newNote);
    writeNotes(notes, () => {
      res.json(newNote);
    });
  });
});

// route to serve the index.html file for all other routes
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

// delete data
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    const updatedNotes = notes.filter((note) => note.id != noteId);
    fs.writeFile("./db/db.json", JSON.stringify(updatedNotes), (err) => {
      if (err) throw err;
      res.json(updatedNotes);
    });
  });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
