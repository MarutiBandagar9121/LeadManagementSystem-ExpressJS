const express = require("express");
const testRoutes = require("./routes/testRoutes");
const config = require("./config/config");
const connectDB = require("./config/database");

connectDB();

const app = express();



app.use("/test", testRoutes)


app.listen(config.port, () => {
  console.log(`civil guruji app listening on port ${config.port}`);
});