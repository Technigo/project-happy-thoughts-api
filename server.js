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

// Create a list of all endpoints
const listEndpoints = require('express-list-endpoints');

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


// Schemas and models start here
const { Schema } = mongoose;

const ThoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  heart: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
}); 

const Thought = mongoose.model("Thought", ThoughtSchema);

// Start defining your routes here
app.get("/", (req, res) => {
  res.status(200).send({
    succes: true,
    message: "OK",
    body: {
      content: "Johannas Happy Thoughs API",
      endpoints: listEndpoints(app)
    }
  });
});

// Finding thoughts, sort them in descening (desc) order by creation date and limit thoughts to 20 and execute query
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.status(200).json(thoughts);
});

app.get("/thoughts/id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleThought = await Thought.findById(id)
    if (singleThought) {
      res.status(200).json(singleThought);
    } else {
      res.status(400).json('Not found');
    }
    } catch (e) {
      res.status(400).json('No id found');
    }
});


app.post("/thoughts", async (req, res) =>{
  const { message } = req.body;
    try {
      const thought = await new Thought({ message }).save();
      res.status(201).json({
        succes: true,
        response: thought,
        message: "Created with success"
      });
    } catch (e) {
      res.status(400).json({
        succes: false,
        response: e,
        message: "Error occurd whilst posting your thought"
      });
    }
});

app.patch("/thoughts/id/:_id/like", async (req, res) => {
  const { id } = req.params;
  try {
    const thought = await Thought.findByIdAndUpdate(
      _id, 
      { $inc: { heart: 1 } }, 
      { new: true }
    );
    
    res.status(200).json({
      succes: true,
      response: {},
      message: "Like recieved successfully"
    });
  } catch(e) {
    res.status(400).json({
      succes: false,
      response: e,
      message: "An error occured whilst liking"
    });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// POST - create something, PATCH - update, PUT - replace
// Type is most important. Required is true or false
// Unique needs a name that is different from the others (that's already in the db)
// Trim removes unnecessary whitespaces from string
// Enum is an array of the alloewd values