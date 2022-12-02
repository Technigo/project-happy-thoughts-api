import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/projectHappyThoughtsAPI";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on.
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Middleware set up for error msg like DB down.
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
}) 

// Start page
app.get("/", (req, res) => {
   res.send({
    responseMassage: "Hello Everybody and welcome, This is a backend built for Frontend project Happy Thoughts from w7!",
    guide: "To access the frontend use netlify Link: https://happy-thought-nina-berggren.netlify.app/ ",
    Routes:[{
        "/thoughts": "send GET request to see all thoughts, send POST request to create a new Happy Thought.",
        "/thoughts/:id/like": "Updates and stor how many likes (hearths) a thought gets.",
      }],
  });
});

////////////////
// Created Schema, the skelleton our structure, how the object suppose to look.

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    // removes unnecessary whitespaces
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

// Created model
// allow us to do search, findes, find Id
const Thought = mongoose.model("Thought", ThoughtSchema);

// GET Endpoint returns 20 thoughts, ordered by createdAt in descending order.
app.get("/thoughts", async (req, res) => {
  try {
    const ListOfThoughts = await Thought.find().sort({createdAt: `desc`}).limit(20).exec()
    res.json(ListOfThoughts)    
  } catch (error) {
    res.status(400).json({success: false, response: error})
  }
})

// POST Endpoint, we get our data from JSON body. If input is valid, thought is saved 
// and response includes thought object with _id.
// POST handel with promisis
app.post("/thoughts", (req, res) => {
    const {message, createdAt} = req.body
    // console.log(req.body);
      const newThought =  new Thought({message: message, createdAt: createdAt}).save()
        .then(newThought => {
          res.status(201).json({succeess: true, response: newThought})
      }).catch(error => {
        res.status(400).json({success: false, response: error})
      })
  })

// 

// PATCH Endpiont (change/modify stuff)when ❤️ clicked, findes the thought and updates the like property and add one hart.
// Harts / Likes

app.patch("/thoughts/:id/like", async (req, res) => {
  const { id } = req.params;
  try {
   const updateThoughtLikes = await Thought.findByIdAndUpdate(id, {$inc: {hearts: 1}});
   res.status(200).json({success: true, response: `Thought ${updateThoughtLikes.id} has their likes updated`});
  } catch (error) {
   res.status(400).json({success: false, response: "id not found", error: error});
  }
});
///////////////
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
