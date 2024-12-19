import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";

dotenv.config()

const mongoURI = process.env.MONGODB_URI

mongoose.connect(mongoURI)
.then(() => {
  console.log('MongoDB successfully connected!')
  })
  .catch((error) => {
  console.error('Error to connect with MongoDB', error)
  })

// Setting a Schema and model
const Thought = mongoose.model("Thought", new mongoose.Schema({
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
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId, //stores preferences to user object
    ref:"User"
  }],
  createdAt: {
    type: Date,
    default: () => new Date()
  }
}))
// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

app.use(cors({
  origin: "https://post-happy-thoughts.netlify.app",
  methods: ["GET", "POST"], // Specify allowed methods
  allowedHeaders: ["*"], // Specify allowed headers, in this case all
}));

app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);
  res.json({
    message: "These are the endpoints of the Happy Thoughts API",
    endpoints: endpoints
  })
});

app.get("/thoughts", async (req, res) => {
  try {
    // returning 20 thoughts in descending order
    const thoughts = await Thought.find().sort({createdAt: "desc"}).limit(20).exec();
    res.json(thoughts)
  }catch (error) {
    console.error('Error retrieving thoughts', error);
      res.status(500).send('Server error');
  }
  });

  app.post("/thoughts", async (req, res) => {
    try{
      //retrieve the information sent by the client to the API endpoint
      const {message} = req.body;
      //use the mongoose model to create the DB entry
      const newThought = new Thought({message});
      await newThought.save();

      res.status(201).json(newThought);
    } catch(error) {
      res.status(400).json({message: "Could not save thought", errors: error.err.errors})
    }
    });

    // Like a thought (increase of hearts)
    app.post("/thoughts/:id/like", async (req, res) => {
      try {
        const {id} = req.params
        const thought = await Thought.findById(id)
        if(!thought) {
          return res.status(404).json({message: "Thought was not found"})
        }
        if (thought.hearts %2=== 0) {
          thought.hearts+=1
        } else {
          thought.hearts -=1
        }
        const updatedThought = await thought.save()

        // const {id} = req.params;
        // const updatedThought = await Thought.findByIdAndUpdate(
        //   id,
        //   {$inc: {hearts:1}}, 
        //   {new: true}
        // );
        // if(!updatedThought) {
        //   return res.status(404).json({message: "Thought not found"});
        // }
        res.status(200).json(updatedThought);
      } catch (error){
        console.error("There is an errow by liking the thought", error);
        res.status(500).jason({message: "Could not like thought"})
      }
    })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});