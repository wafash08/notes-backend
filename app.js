const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const notesRouter = require("./controllers/note");
const middleware = require("./utils/middleware.js");
const logger = require("./utils/logger");

logger.info("connecting to", config.MONGODB_URI);

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
