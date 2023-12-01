const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const thoughtRoutes = require("./routes/thoughtRoutes");
const expressListEndpoints = require("express-list-endpoints");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

app.use("/", thoughtRoutes);

app.get("/endpoints", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
