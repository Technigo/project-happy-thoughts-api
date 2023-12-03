import express from "express";
import mongoose from "mongoose";
import cors from "cors";
const thoughtRoutes = require("./routes/thoughtRouter");

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on.
const port = process.env.PORT || 9000;
const app = express();

// Adds middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use("/", thoughtRoutes)
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status("503").json({
      error: "Service unavailable"
    })
  }
})

// Starts the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
