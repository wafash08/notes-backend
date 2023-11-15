const app = require("./app"); // the actual Express application
const config = require("./utils/config");

// mongoose.set("strictQuery", false);

// async function connectDB() {
//   try {
//     logger.info("connecting to", config.MONGODB_URI);
//     const conn = await mongoose.connect(config.MONGODB_URI);
//     logger.info(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     logger.error("error connecting to MongoDB:", error.message);
//     process.exit(1);
//   }
// }

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
