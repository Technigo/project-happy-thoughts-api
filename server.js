import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes/Routes.js";

const app = express();

// Add middlewares to enable cors and json body parsing
app.use(
  cors({
    origin: ["https://happyhappenings.netlify.app"],

    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "updatedthoughtlike"],
  })
);
app.use(express.json());
app.use("/", router);

// Defines the port the app will run on.
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
