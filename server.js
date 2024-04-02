import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import thoughtsRouter from "./routes/thoughtsRoutes.js"; // Adjust the path as necessary
import dotenv from "dotenv";

dotenv.config();

// Configure your MongoDB connection string
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-happy-thoughts';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

const app = express();

// CORS configuration to allow requests from your frontend domain
const corsOptions = {
  origin: 'https://project-happy-thoughts-vite.vercel.app', // Update this to your frontend's actual domain
};

// Use CORS middleware with the specified options
app.use(cors(corsOptions));

app.use(express.json());

// Use the thoughtsRouter for handling requests to "/"
app.use('/', thoughtsRouter);

// Basic endpoint to list available routes (you might need to adjust this based on actual usage)
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Happy Thoughts API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error', error: err });
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
