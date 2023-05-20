import express, { response } from "express";
import cors from "cors";
import mongoose, { get } from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/happy-thoughts";
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

const { Schema } = mongoose;
const PostSchema = new Schema({
  text: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140 
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

const Post = mongoose.model("Post", PostSchema)

// This endpoint should return a maximum of 20 thoughts, sorted by createdAt to show the most recent thoughts first.
app.get("/thoughts", async (req, res) => {
  try {
    const post = await Post.find().sort({createdAt: 'desc'}).limit(20).exec()
    res.status(200).json({
      success: true,
      response: post,
      message: "Thoughts retrieved!"
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong!",
      response: error
    })
  }
})

// This endpoint expects a JSON body with the thought message
app.post("/thoughts", async (req, res) => {
  const { text } = req.body
  try {
    const savedPost = await new Post({ text }).save()
    res.status(200).json({
      success: true,
      response: savedPost,
      message: "Thought saved!"
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Could not create thought!",
      response: error
  })
}})

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { postId } = req.params
  try {
    const savedLike = await Thought.findByIdAndUpdate(
      postId,
      { $inc: { hearts: 1 } },
      { new: true }
    )
    res.status(200).json({
      success: true,
      message: "Like posted!",
      response: savedLike
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Could not save like",
      response: error
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
