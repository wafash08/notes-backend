require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Note = require('./models/note');

const app = express();
const PORT = process.env.PORT;

function requestLogger(request, response, next) {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
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
app.use(express.static('dist'));
app.use(express.json());
app.use(requestLogger);

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes);
  });
});

app.post('/api/notes', (req, res, next) => {
  const body = req.body;

  // if (body.content === undefined) {
  //   return res.status(400).json({ error: "Content missing" });
  // }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then(savedNote => {
      res.json(savedNote);
    })
    .catch(error => next(error));
});

app.get('/api/notes/:id', (req, res) => {
  const noteID = req.params.id;
  Note.findById(noteID)
    .then(note => {
      if (!note) {
        res.status(404).end();
      }
      res.status(200).json(note);
    })
    .catch(error => {
      // called if the id is invalid
      console.log(error);
      res.status(400).send({ error: 'malformatted id' });
    });
});

app.delete('/api/notes/:id', (req, res, next) => {
  const noteID = req.params.id;
  Note.findByIdAndDelete(noteID)
    .then(result => {
      console.log('result >>', result);
      res.status(204).end();
    })
    .catch(error => next(error));
});

app.put('/api/notes/:id', (req, res, next) => {
  const noteID = req.params.id;
  const body = req.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(noteID, note, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then(updatedNote => {
      res.json(updatedNote);
    })
    .catch(error => next(error));
});

function unknownEndpoint(request, response) {
  response.status(404).send({ error: 'unknown endpoint' });
}

app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  next(err);
};

app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
