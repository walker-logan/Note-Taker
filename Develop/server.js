const express = require("express");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const PORT = process.env.PORT || 3001;

const app = express();

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

app.post("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    let notes = JSON.parse(data)
    const newNote = {
      title: req.body.title,
      text: req.body.text,
      id: uniqid(),
    };
    notes.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(notes), err => {
    if (err) {
      console.log("error");
    }
    res.json(newNote);})
  })

})


app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);


