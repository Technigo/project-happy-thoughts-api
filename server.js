import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import thoughtRoutes from "./routes/thoughts";

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data to a json
app.use(thoughtRoutes);

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
