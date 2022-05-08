import express from "express";
import cors from "cors";
import bodyParser from "body-parser"

import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
console.log('connected to Mongo DB'))

mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())

const thoughtsRoute = require('./routes/thoughts')
app.use('/thoughts', thoughtsRoute)

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("This is all thoughts");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
