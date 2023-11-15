const app = require("./app"); // the actual Express application
const config = require("./utils/config");

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
