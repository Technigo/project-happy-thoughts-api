import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import thougtRoutes from "./routes/thoughtRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const mongoUrl =
  process.env.MONGO_URL || "mongodb://127.0.0.1/project-happy-thoughts-API";
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected")) // Check if connected to MongoDB
  .catch((err) => console.log(err));
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// The routs are located in the routes folder to keep the server.js file clean
app.use(thougtRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
