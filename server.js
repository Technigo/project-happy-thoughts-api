import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import router from "./routes/thoughtsRoutes";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-happy-thoughts'; // Fallback to local DB if MONGO_URL not set
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

const app = express();
app.use(cors());
app.use(express.json()); // Ensure you parse JSON bodies

// Mount the router on a path, for example '/api'
app.use('/api', router);

// Endpoint to list all available routes
app.get('/', (req, res) => {
  res.json({ endpoints: listEndpoints(app) });
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
