import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import thoughtsRouter from "./routes/thoughtsRouter";
import dotenv from "dotenv";
// Load environment variables from the .env file
dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


// Defines the port the app will run on. Defaults to 8080, but can be overridden
const port = process.env.PORT; // Set the port number for the server
const app = express(); // Create an instance of the Express application

// Add middlewares to enable cors and json body parsing
app.use(cors()); // Enable CORS (Cross-Origin Resource Sharing)
app.use(express.json()); // Parse incoming JSON data
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data to a json
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status("503").json({ //returns a 503 Service Unavailable error to the client, indicating that the service cannot currently handle the request due to a lack of database connectivity.
      error: "Service unavailable"
    });
  }
});

// Use the routes for handling the API requests!
//Route to list all the endpoints
app.get('/', (req, res) => {
  res.json({ endpoints: listEndpoints(app) });
});
//access the other routes
app.use(thoughtsRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
