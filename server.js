import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Message = new mongoose.model("Message", {
  text: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Retrieve the first 20 messages, sorted in descending order
app.get("/", async (req, res) => {
  const messages = await Message.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();
  try {
    res.json(messages);
  } catch {
    res.status(400).json({
      message: "No happy thoughts were found 😢"
    });
  }
});

// Post a new happy thought
app.post("/", async (req, res) => {
  // Retrieve the information sent by the client to our API endpoint
  const { text } = req.body;

  // Use our moongose model to create the database entry
  const message = new Message({ text });

  try {
    // Success
    const savedMessage = await message.save();
    res.status(201).json(savedMessage)
  } catch (err) {
    // No success
    res.status(400).json({
      message: "Couldn't save your happy thought, please hold on to it.",
      error: err.errors
    });
  }
});

// Update like button
app.post("/:messageId/like", async (req, res) => {
  const { messageId } = req.params;

  try {
    await Message.updateOne({ _id: req.params.messageId }, { $inc: { likes: 1 } });
    res.status(200).json()
  } catch (err) {    
      res.status(400).json({
        message: "My apologies, could not update.",
        error: err.errors
      });    
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
