import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import thoughtRoutes from "./routes/thoughtRoutes";
import { ThoughtModel } from "./models/Thought";

mongoose.set("strictQuery", false);

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

app.use(thoughtRoutes);

const mongoUrl =
  process.env.MONGO_URL ||
  "mongodb://127.0.0.1:27017/project-happy-thoughts-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// const seedData = [];

// if (process.env.RESET_DB) {
//   const seedDatabase = async () => {
//     console.log("Resetting database!");

//     await ThoughtModel.insertMany({});

//     for (const thought of seedData) {
//       await new ThoughtModel(thought).save();
//     }
//   };
//   seedDatabase();
// }

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
