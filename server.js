import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import happyRoutes from "./routes/happyRoutes";

mongoose.set("strictQuery", false);
const mongoUrl =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/happy-thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;
// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Middleware to check MongoDB connection status
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service Unavailable" });
  }
});
// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
// Parse URL-encoded data
app.use(express.urlencoded({ extended: false }));

app.use(happyRoutes);
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
