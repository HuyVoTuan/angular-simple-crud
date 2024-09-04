const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

// routes
const itemsRoute = require("./src/routes/items.route");

dotenv.config();

app.use(cors());
app.use(express.static("public"));
app.use(express.json({ extend: true }));
app.use(express.urlencoded({ extended: true }));

// env
const PORT = process.env.PORT || 3000;

// connect to DB
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.DB_NAME,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 20000,
  heartbeatFrequencyMS: 10000,
  retryWrites: true,
  w: "majority",
};
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DB_CONNECT, options)
  .then(() => {
    console.log("Connected to the database ");
  })
  .catch((error) => console.log("Connect Fail: ", error));

app.get("/", (_, res) => res.send("API running"));

// route
app.use("/api/items", itemsRoute);

app.listen(PORT, () => {
  console.log(`Server Up and running localhost: ${PORT}`);
});
