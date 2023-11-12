const mongoose = require("mongoose");
const app = require("./app"); // the actual Express application
const config = require("./utils/config");
const logger = require("./utils/logger");

mongoose.set("strictQuery", false);

async function connectDB() {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error("error connecting to MongoDB:", error.message);
    process.exit(1);
  }
}

connectDB().then(() => {
  app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
  });
});
