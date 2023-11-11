const express = require("express");
const cors = require("cors");

const app = express();

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
  res.status(200).json(notes);
});

app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({ error: "Content missing" });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateID(),
  };

  notes = notes.concat(note);

  res.json(note);
});

app.get("/api/notes/:id", (req, res) => {
  // id bertipe string karena itu perlu diubah menjadi number
  const id = Number(req.params.id);
  const note = notes.find(n => n.id === id);

  if (!note) {
    res.status(404).end();
  }

  res.json(note);
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter(note => note.id !== id);

  res.status(204).end();
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function generateID() {
  const listOfNotesID = notes.map(note => note.id);
  const maxID = notes.length > 0 ? Math.max(...listOfNotesID) : 0;
  return maxID + 1;
}
