
import express, { response } from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thoughts";
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

////////////////
const ThoughtsSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 140,
    trim: true
  },
  hearts: {
    type: Number,
    // initial value, if none other is specified
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
});

const Thoughts = mongoose.model("Thoughts", ThoughtsSchema);


app.get("/", (req, res) => {
  res.send({
    Message: "Happy thoughts API",
    Routes: [{
      "/thoughts": "GET to see all thoughts, POST to create a new thought"
    }]
  });
});

app.get("/thoughts", async (req, res) => {
  try {
    const allThoughts = await Thoughts.find().sort({createdAt: "desc"}).limit(20).exec();
    res.status(200).json(allThoughts);
  } catch (error) {
    res.status(400).json({success: false, response: 'bad request'})
  }
});

 app.post("/thoughts", async (req, res) => {
  const {message, createdAt} = req.body;
   console.log(req.body);
   try {
    const newThought = await new Thoughts({message: message, createdAt: createdAt}).save();
    res.status(201).json({success: true, response: newThought});
   } catch(error) {
     res.status(400).json({success: false, response: 'cannot post mesage'});
   }
 });

app.patch("/thoughts/:id/hearts", async (req, res) => {
   const { id } = req.params;
   try {
    const thoughtToUpdate = await Thoughts.findByIdAndUpdate(id, {$inc: {hearts: 1}});
    res.status(200).json({success: true, response: `Message ${thoughtToUpdate.message} is updated`});
   } catch (error) {
    res.status(400).json({success: false, response: error});
   }
});
///////////////
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
