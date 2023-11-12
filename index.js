require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Note = require("./models/note");

const app = express();
const PORT = process.env.PORT;

function requestLogger(request, response, next) {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
}

function unknownEndpoint(request, response) {
  response.status(404).send({ error: "unknown endpoint" });
}

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static("dist"));

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes);
  });
});

app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (body.content === undefined) {
    return res.status(400).json({ error: "Content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then(savedNote => {
    res.json(savedNote);
  });
});

app.get("/api/notes/:id", (req, res) => {
  const noteID = req.params.id;
  Note.findById(noteID).then(note => {
    res.json(note);
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter(note => note.id !== id);

  res.status(204).end();
});

app.use(unknownEndpoint);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
