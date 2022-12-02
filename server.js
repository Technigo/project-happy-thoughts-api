import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from 'express-list-endpoints'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happythoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


const ThoughtSchema  =  new mongoose.Schema({
    message:{
        type: String,
        required : true,
        minlength: 5,
        maxlength: 140,
        trim: true, 
    },
    hearts: {
        type: Number,
        default: 0
    }, 
    createdAt: {
        type: Date, 
        default: () => new Date()
    }
})

const Thought = mongoose.model('Thought', ThoughtSchema)


// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


// if connection to server is down, show below and don't move to routes
app.use((req, res, next) => {
    if (mongoose.connection.readyState === 1) {
      next()
    } else {
      res.status(503).json({ 
        status_code: 503,
        error: "Server unavailable" })
    }
})

// ROUTES

app.get("/", (req, res) => {
    res.json({
      ResponseMessage: "Welcome to Our Happy Thoughts-API! Se live version at https://our-happy-thoughts.netlify.app/ 🌞",
    });
  });

// Lists all endpoints available
app.get('/endpoints', (req, res) => {
    res.send(listEndpoints(app))
})

// Get all thoughts in descending order, maximum of 20
app.get('/thoughts', async (req, res) => {
    const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
    res.json(thoughts);
})

// Create a new thought
app.post('/thoughts', async (req, res) => {
    // Retrieve the information sent by the client to our API endpoint
    const { message } = req.body;

    // Use the mongoose model to create the database entry
    const thought = new Thought({ message })

    try {
        const newThought = await thought.save();
        res.status(201).json({ 
         response: newThought, 
         success: true 
        })
    } catch (error) {
        res.status(400).json({
         message: "Not able to post your thought",
         response: error, 
         success: false
        });
    }
})

// Update like by thought id
app.patch("/thoughts/:thoughtId/like", async (req, res) => {
    const {thoughtId} = req.params;
    try {
    const thoughtToUpdate = await Thought.findByIdAndUpdate(thoughtId, {$inc: {hearts: 1}});
    res.status(200).json({sucess: true, response: `Thought ${thoughtToUpdate.id} has their likes updated`});
  } catch (error) {
    res.status(400).json({success: false, response: "id not found", error: error})
  }
  });
  
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
