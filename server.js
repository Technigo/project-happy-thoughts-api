import express from "express";
import cors from "cors";
import dotenv from "dotenv"; // Import dotenv for environment variables
import mongoose from "mongoose";
import thoughtsRoutes from "./routes/thoughtsRoutes"; // Import routes for handling song-related endpoints

dotenv.config(); //Load environment variables from the .env file

const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({
      // Returns a "503 Service Unavailable error" to the client, indicating that the service cannot currently handle the request due to an issue with the database connection.
      error: "Service unavailable",
    });
  }
});

// Imported routes in the app
app.use(thoughtsRoutes); // Mounting song-related routes in the Express app

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
