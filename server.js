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
/////////////////////



const HappyThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,  
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

const HappyThought = mongoose.model("HappyThought", HappyThoughtSchema);

/////////////////////
// Start defining your routes here
app.get("/", (req, res) => {
  res.send({
    Routes: [
      `GET /thoughts This endpoint should return a maximum of 20 thoughts, sorted by 'createdAt' to show the most recent thoughts first.`,
      `POST /thoughts This endpoint expects a JSON body with the thought 'message', like this: { "message": "Express is great!" }. If the input is valid (more on that below), the thought should be saved, and the response should include the saved thought object, including its _id`,
      `POST thoughts/:thoughtId/like This endpoint doesn't require a JSON body. Given a valid thought id in the URL, the API should find that thought, and update its 'hearts' property to add one heart.`
    ]
  });
});


app.post("/thoughts", async (req, res) => {

  const { message } = req.body;

  try {
    const newThought = await new HappyThought({message: message}).save();
    
    res.status(201).json({response: newThought, success: true});
  } catch(error) {
    console.log("fail")
    res.status(400).json({response: error, success: false});
  }

});


app.post("/thoughts/:id/like", async (req, res) => {
  const { id } = req.params;
  try {
    const thoughtToUpdate = await HappyThought.findByIdAndUpdate(id, {$inc: {hearts: 1}});
    res.status(200).json({response: `Thought '${thoughtToUpdate.message}' has been liked`, succes: true});
  } catch (error) {
    res.status(400).json({response: error, succes: false});
  }
});

app.get("/thoughts", async (req, res) => {
  // const { id, name } = req.query;
  // const thoughts = await HappyThought.find();
  // console.log(thoughts);
  // res.status(200).json("hej")

  try {
    let thoughts = await (await HappyThought.find().sort({ createdAt: "desc" })).splice(0, 20);
    
    res.status(200).json({
      response: thoughts,
      success: true
    })
  } catch (err) {
    res.status(400).json({
      response: "Could not fetch thoughts",
      success: false
    })
  }

  // if (id) {
	// 	authors = authors.filter(item => item._id.toString() === id);
	// };

  // if (name) {
  //   authors = authors.filter(
  //     (author) => author.name.toLowerCase().includes(name.toLowerCase())
  //   )
  // };

  // if (thoughts) {
  //   res.json(thoughts);
  // } else {
  //   res.status(404).json({ error: "No happy thoughts found" })
  // } 
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
