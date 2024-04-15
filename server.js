import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import thoughtRoute from "./routes/thoughtRoute";
import dotenv from "dotenv";

dotenv.config();

// Define the MongoDB connection URL, default to a local database
const mongoUrl = process.env.MONGO_URI || "mongodb://localhost/project-mongo";

// Connect to the MongoDB database
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.use("/", thoughtRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
