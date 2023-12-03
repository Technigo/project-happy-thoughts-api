import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const listEndpoints = require("express-list-endpoints");

const thoughtsRouter = require("./routes/thoughtsRoute");

const dotenv = require("dotenv");
dotenv.config();

const mongoUrl =
  process.env.MONGO_URL.replace("<PASSWORD>", process.env.DATABASE_PASSWORD) ||
  "mongodb://localhost:27017/project-happy-thoughts";

mongoose.set("strictQuery", false);
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => console.log("connected"));

const port = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", thoughtsRouter);
app.get("/", (req, res) => {
  res.json(listEndpoints(app));
});
app.all("*", (req, res, next) => {
  res.status(501).json({ status: "fail", message: "Not Implemented Endpoint 💥 " });
  next();
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
