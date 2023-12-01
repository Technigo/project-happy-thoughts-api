import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Thought from "./models/Thought";
import Routes from "./routes/Routes";
import setUpRoutes from "./routes/Routes";

const mongoUrl =
  process.env.MONGO_URL ||
  "mongodb://127.0.0.1:27017/project-happy-thoughts-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// wrap this part in an inviroment variabel

// const seedData = [
//   { message: "gooo", heart: 0 },
//   { message: "do do do", heart: 0 },
// ];
// //Seeding function
// async function seedDatabase() {
//   try {
//     // Optionally clear existing data
//     await Thought.deleteMany({});

//     // Insert seed data
//     await Thought.insertMany(seedData);

//     console.log("Database seeded successfully!");
//   } catch (error) {
//     console.error("Error seeding database:", error);
//   }
// }
// seedDatabase();

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
// const listEndpoints = require("express-list-endpoints");

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
//app.use(Routes);

setUpRoutes(app); // Attach routes to the app

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  // seedDatabase();
});
