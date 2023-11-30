import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import thoughtRoutes from "./routes/thoughtRoutes.js";



dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose
    .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connection to MongoDB:", error.message);
    });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false})) // Parse URL-encoded data

// Route definitions
app.use(thoughtRoutes);

// Error handlign for server state
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Servide unavailable" })
  }
})

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
