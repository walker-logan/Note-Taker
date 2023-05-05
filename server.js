const express = require("express");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const app = express();
const DB_PATH = path.join(__dirname, "Develop", "db", "db.json");
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
  fs.readFile(DB_PATH, (err, data) => res.send(data));
});

app.post("/api/notes", (req, res) => {
  fs.readFile(DB_PATH, "utf8", (err, data) => {
    let notes = JSON.parse(data);
    const newNote = {
      title: req.body.title,
      text: req.body.text,
      id: uniqid(),
    };
    notes.push(newNote);
    fs.writeFile(DB_PATH, JSON.stringify(notes), (err) => {
      if (err) {
        console.log("error");
      }
      res.json(newNote);
    });
  });
});

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

// delete data
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  fs.readFile(DB_PATH, "utf8", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    const updatedNotes = notes.filter((note) => note.id != noteId);
    fs.writeFile(DB_PATH, JSON.stringify(updatedNotes), (err) => {
      if (err) throw err;
      res.json(updatedNotes);
    });
  });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
