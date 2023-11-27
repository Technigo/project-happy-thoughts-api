import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const Thought = require('./models/thought')

const listEndpoints = require("express-list-endpoints")

// ----------- Routes starts here --------- //

app.get("/", (req, res) => {
  const documentation = {
    endpoints: listEndpoints(app),
    additionalInfo: {
      "/thoughts": {
        description: "Description here"
      },
    },
  }

  res.json(documentation)
})

//Route to get 20 latest thoughts
app.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch thoughts, please try again', error: error });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});