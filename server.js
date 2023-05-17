import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-mongo";
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

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Happy thoughts!");
});

const { Schema } = mongoose;
const ThoughtSchema = new Schema({
  message: {
    // most important one
    type: String,
    required: true, // required true which means the user MUST provide a message in order to send it. 
    maxlength: 140,
    minlength: 5,
    trim: true // removes unnecessary whitespaces from string
  },
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  
}); 

const Thought = mongoose.model("Thought", ThoughtSchema);

////////////GET-REQUEST/////////
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec() 
  // 1. Thought.find() asks for all documents (thoughts) without any specific filter. 
  // 2. .sort({createdAt: 'desc'}) sorts the retrieved thoughts based on createdAt-field in descending order, so the most recent thoughts goes on top. 
  // 3. .limit(20) limits the number of thoughts returned to 20. Only the latest 20 thoughts are retreived. 
  // 4. .exec() executes the query
  try {  
    res.status(200).json({ //sets the response status code to 200 and prepares the response as a json object
      success: true,
      response: thoughts, //this is where the thoughts are store, that's why I needed to changes the code in the original Happy Thoughts-project, the structure is different from the original API
      message: "Sucessfully fetched messages."
    })
  } catch (e) {
    res.status(400).json({
      success: false, 
      response: e, //includes the error object and message caught in the catch block. 
      message: "Bad request, couldn't fetch thoughts"
    })
  }
})

//////////POST REQUEST/////////
app.post("/thoughts", async (req, res) => {
  const {message, createdAt} = req.body;
    try {
      const savedThought = await new Thought({message: message, createdAt: createdAt}).save();
      res.status(201).json({
       success: true,
        response: savedThought,
        message: "Created thought successfully."
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        response: e,
        message: "Did not create thought successfully." 
      });
    }
});



////////////POST-REQUEST FOR ADDING LIKES////////////////
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params
  try {
    const MessageWithUpdatedLikes = await Thought.findByIdAndUpdate(thoughtId, {$inc: {likes: 1 } })
    res.status(201).json({
      success: true,
      response: `Happy thought: ${MessageWithUpdatedLikes.message} has been updated`
    })
  } catch (e) {
    res.status(400).json({
      success: false, 
      response: e,
      message: "Could not save like to message."
    })
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
