import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8000;
const app = express();

// Create Model for mongo database
const Thought = mongoose.model("Thought", {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    // trim removes unnecessary whitespaces
    trim: true,
  },
  hearts: {
    default: 0,
    type: Number,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

// Add middlewares to enable cors and json body parsing
app.use(cors());
// app.use(express.json());
app.use(bodyParser.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Send your happy Thoughts!");
});

// Creating endpoint Get Request
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();
    res.status(201).json({ success: true, response: thoughts });
  } catch (error) {
    res.status(400).json({ success: false, response: error });
  }
});

//Post request
app.post("/thoughts", async (req, res) => {
  // Message which created by users
  const { message, hearts } = req.body;

  // our Mongoose createing database according to users message
  const thought = new Thought({ message, hearts });
  try {
    const savedThought = await thought.save();
    res.status(200).json({ response: savedThought, success: true });
  } catch (error) {
    res.status(400)
      .json({
        message: "Could not save message",
        error: err.errors,
        success: false,
      });
  }
});

//update
app.patch('/thoughts/:id', async(req, res)=>{
  const {id} = req.params;
  try{
    const updateThoughts= await Thought.findByIdAndUpdate({_id, id}, {hearts:updateThoughts});
    if(updateThoughts){
      res.status(200).json({success:true, response:updateThoughts});
    }
    else{

      res.status(404).json({success:false, response:"Thought Not Found"})
    }
    
  }catch(error){
     res.status(400).json({success: false, response: error});

  }

})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
