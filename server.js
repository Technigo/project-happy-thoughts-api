import express from "express";
import cors from "cors";
import mongoose from "mongoose";

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

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

//////// Live sesh //////////
const { Schema } = mongoose;
const ThoughtSchema = new Schema ({
  message: {
    // Most important one is:
    type: String,
    // required is true or false
    required: true,
    minlength: 4,
    maxlength: 140,
    //removes unnecessary white spaces from string
    trim: true
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  })

const Thought = mongoose.model("Thought", ThoughtSchema)

app.get('/thoughts', async (req, res) => {
  const displayThoughts = await ThoughtsList.find().sort({createdAt: 'desc'}).limit(20).exec();
    try {
      res.status(200).json({
        success: true, 
        response: displayThoughts,
        message: "Found the thoughts"
      });
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "Did not find thoughts", 
      error: e.errors
     });
  }
})

app.post('/thoughts', async (req, res) => {
  const {message, name, hearts, createdAt} = req.body;
  try{
    const thoughts = await new Thought({ message, name, hearts, createdAt }).save()
    res.status(201).json({
      success: true,
      response: thoughts,
      message: "created successfully"
    })
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "error occurred"
  })
}
})

app.post('/thoughts/:thoughtId/like', async (req, res) => {

})
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
