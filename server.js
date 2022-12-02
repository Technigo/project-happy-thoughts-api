import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv"


dotenv.config()
const mongoUrl = process.env.MONGO_URL || `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@cluster0.lmkbhok.mongodb.net/happythoughtsAPI?retryWrites=true&w=majority`;
// "mongodb://localhost/project-mongo";
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

// Displaying thoughs in descending order with a maximum of 20 thoughts.
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thoughts.find().sort({createdAt: "desc"}).limit(20).exec();
  res.json(thoughts);
})

app.post('/thoughts', async(req, res) =>{
  // Collect the information sent by the client to our API 
  const {message , hearts} = req.body;

  // Use our mongoose model to create the database entry - to save
  const thought = new Thoughts({message, hearts})
  try{
    const savedThought = await thought.save();
  res.status(201).json(savedThought);
  }catch(err){
    res.status(400).json({message: 'Could not save thought to the database', errors: err.errors});
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
