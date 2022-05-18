import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
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


// The Schema makes it possible to reuse the code
const HappyThoughtsSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    // Trim (boolean) deletes whitespace, but only from the beginning to the end of description string
    trim: true
  },
  heart: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    // Anonymous function to add new date. Simliar to event listeners, every time user creates a thought we call it again
    default: () => new Date()
  }
})

const HappyThoughts = mongoose.model('HappyThoughts', HappyThoughtsSchema)


// ----------------------/START-------------------------- //
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});


// ----------------------/GET THOUGHTS-------------------------- //
app.get('/thoughts', async (req, res) => {
  // const { page, perPage } = req.query

  try {
    const allThoughts = await HappyThoughts.find({}).sort({createdAt: 'desc'}).limit(20)

    res.status(200).json(allThoughts)
   } catch (error) {
    res.status(400).json({success: false, response: error})
   }
})

// ----------------------/UPDATE LIKE ON HEART---------------------- //
app.post("/thoughts/:id/like", async (req, res) => {
  const { id } = req.params

  try {
    const thoughtToLike = await HappyThoughts.findByIdAndUpdate(id, { $inc: { heart: 1 } })

    res.status(201).json(thoughtToLike) 
  } catch (error) {
    res.status(400).json({response: error, success: false})
  }
})


// ----------------------/POST THOUGHT------------------------ //
app.post('/thoughts', async (req, res) => {
  const { message } = req.body
  console.log(req.body)
  try {
    const newMessage = await new HappyThoughts({message: message}).save()

    res.status(201).json({response: newMessage, success: true})
  } catch (error) {
    res.status(400).json({response: error, success: false})
  }
})



// ----------------------/START SERVER------------------------ //
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
