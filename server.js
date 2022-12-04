import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";


dotenv.config()
const mongoUrl = process.env.MONGO_URL || `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@cluster0.lmkbhok.mongodb.net/happythoughtsAPI?retryWrites=true&w=majority`;
// "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


const port = process.env.PORT || 8080;
const app = express();

//an express middleware to check if mongoose is ready and throw an error if not. Note: Should always be added before the router.
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({
      error: `Service unavailable`
    })
  }
})

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//Define the model and SchemaTypes in Mangoose
const ThougtsSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 4,
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

const Thoughts = mongoose.model("Thoughts", ThougtsSchema);

//*******ROUTES*********//

// Start defining your routes here
app.get("/", (req, res) => {
  res.send({ "Routes": listEndpoints(app)});
});

// Displaying thoughts in descending order with a maximum of 20 thoughts.
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thoughts.find().sort({createdAt: "desc"}).limit(20).exec();
  res.json(thoughts);
})

app.post("/thoughts", async(req, res) =>{
  // Collect the information sent by the client to our API 
  const {message , hearts} = req.body;

  // Use our mongoose model to create the database entry - to save
  const thought = new Thoughts({message, hearts})
  try{
    const savedThought = await thought.save();
  res.status(201).json(savedThought);
  }catch(error){
    res.status(400).json({
      message: "Could not save massage to the database", 
      response: error});
  }
})

// update heart likes
app.patch("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params
  try {
  // First argument passid id, second what property should be updated
  const updatedHeart = await Thoughts.findByIdAndUpdate(thoughtId, {$inc: {hearts: 1}});
  res.status(200).json({
    success: true, 
    response: `There are ${updatedHeart.hearts} hearts on this post`})
  } catch (error) {
    res.status(400).json({
      success: false, 
      response: error})
  }
  })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
