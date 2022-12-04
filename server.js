import express, { text } from "express";
import cors from "cors";
import mongoose from "mongoose";
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;
// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:


const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0

  }, 
  createdAt: {
    type: Date,
    default: Date.now
  }

});

const Like = mongoose.model('Like', {
    Like: {
      type: Boolean,
      hearts: Number
    }
  
  });


// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.json(thoughts);
});

app.post('/thoughts', async (req, res) => {
  //Retrieve the information sent by the client to our API endpoint
 const {message, complete} = req.body;

 //use our mongoose model to create the database entry
 const thought = new Thought({message, complete});

 //to avoid currupt data in database we aure try and catch
 try{
  //success-case
  const savedThought = await thought.save();
  res.status(201).json({success: true, response: savedThought});
//if unseccessful
 } catch (error){
  res.status(400).json({success: false, message: "Could not save happy thought to db", error: err.errors});

 }
});

app.patch("/thoughts/:id/like", async (req, res) => {
  const { id } = req.params;
  try{
  const heartsUpToDate = await Thought.findByIdAndUpdate(id, {$inc: {hearts: 1}})
  res.status(200).json({success: true, response:`Thought ${heartsUpToDate.id} has been updated with a heart`})
  } catch (error) {
    res.status(400).json({success: false, response: "Thought-id not found"});
  }
});

app.delete("/thoughts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedThought = await Thought.findOneAndDelete({ _id: id });
    if (deletedThought) {
      res.status(200).json({
        success: true,
        response: deletedThought,
        message: "thought is now deleted"
      });
    } else {
      res.status(404).json({ success: false, response: "Thought id not found" });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});