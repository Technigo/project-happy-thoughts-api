import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/Happy-Thoughts-API";
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
  res.send(listEndpoints(app));
});
////// Tuesday ////

const { Schema } = mongoose;
const HappyThoughtsSchema = new Schema({
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
  createdAt: {
    type: Date,
    default: new Date()
  },
});

const HappyThoughts = mongoose.model("HappyThoughts", HappyThoughtsSchema);

app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await HappyThoughts.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json({
      success: true,
      response: thoughts,
      message: "Thoughts retrieved successfully"
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "did not successfully"
    });
  }
});


app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  try {
    const newThoughts = await new HappyThoughts({ message }).save();
    res.status(201).json({
      success: true,
      response: newThoughts,
      message: "created successfully"
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "error occured"
    });
  }
});

// create a `POST thoughts/:thoughtId/like`. this endpoint doesn't require a JSON body. Given a valid thought id in the URL, the API should find that thought, and update its `hearts` property to add one heart. Test this in Postman or similar. If it works, you should see the number of hearts increase when you refresh the page for the `GET /thoughts` endpoint. If you refresh the page for the `GET /thoughts/:thoughtId` endpoint, you should see the updated number of hearts there as well. If you restart the server, the number of hearts should be the same as before you restarted the server. This is because the data is stored in the database, and not in the server's memory.
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const updatedThought = await HappyThoughts.findOneAndUpdate({ "_id": thoughtId }, { $inc: { "hearts": 1 } });
    res.status(201).json({
      success: true,
      response: updatedThought,
      message: "created successfully"
    });
  }
  catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "error occured"
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});