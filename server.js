import express from "express";
import cors from "cors";
import bodyParser from "body-parser"
import thoughts from "./routes/thoughts"
import listEndpoints from "express-list-endpoints"

import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, () =>
console.log('connected to Mongo DB'))

mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json())
app.use('/thoughts', thoughts)


app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});