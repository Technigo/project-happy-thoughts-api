import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes/routes";
import { connectDB } from "./config/db";
import dotenv from "dotenv";
dotenv.config();

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(router);

//Callback connect data base function created in config folder
connectDB();

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
