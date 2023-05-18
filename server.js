import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts-api";
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
const listEndpoints = require('express-list-endpoints');

// Start defining your routes here
app.get("/", (req, res) => {
  res.json(listEndpoints(app));
});

const { Schema } = mongoose;
const ThoughtSchema = new Schema({
  message: {
    type: String,
    minlength: 5,
    maxlength:140,
    trim: true
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
});

const Thought = mongoose.model("Thought", ThoughtSchema);

app.get("/thoughts", async (req,res)=> {
  try {  
  const thought = await Thought.find({}).sort({createdAt: -1 }).limit(20);
    res.status(200).json({
      success:true,
      response: thought,
    }) 
  } catch(error) {
      res.status(400).json({
        success:false,
        response:error,
        message: "Something went wrong"
      });

    }
  });


app.post("/thoughts", async (req, res) =>{
  const { message } = req.body;
  const thought = new Thought({ message, createdAt: new Date() });
  const savedThought = await thought.save()
   try{
    res.status(201).json(savedThought);
  } catch (error) {
    res.status(400).json({
      sucess: false,
      error: error,
      message: "Error occurred"
   });
  }
});

app.patch("/thoughts/:id/like", async (req, res) => {
  const { id } = req.params;
  // const { newDescription } = req.body;
  try{
  const updatedHearts = await Thought.findByIdAndUpdate(id, {$inc: {hearts: 1}});
  res.status(200).json({
    success: true,
    response: `Thought ${thoughtToUpdate.id} hearts updated`
  })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error,
      response: "Something went wrong"
    })
  }
});

/*app.delete("/thought/:id", async (req, res) => {
  const { id } = req.params;
  try{
  const deletedThought = await Thought.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "deleted successfully"
  })
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Something went wrong"
    })
  }
});*/


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
