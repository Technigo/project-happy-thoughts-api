import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavaliable" })
  }
});

mongoose.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, converted) => {
    delete converted._id;
  }
});

// MongoDB
const MessageSchema = new mongoose.Schema({
  message: {
    type: String,
    minlength: 5,
    maxlength: 140,
    required: true
  },
  like: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
})

const Message = mongoose.model("Message", MessageSchema);

// Start defining your routes here
app.get("/", (req, res) => {
  res.send([
    {"path":"/messages","url":'https://project-happy-thoughts-api-auhzlcxnrq-lz.a.run.app/messages/',"methods":["GET","POST"]},
    {"path":"/messages/:id/like","url":'https://project-happy-thoughts-api-auhzlcxnrq-lz.a.run.app/messages/:id/like/',"methods":["POST"]}
  ]);
});

app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({createdAt: -1}).limit(20).exec();
    res.status(201).json({
      success: true, 
      response: messages
    });
  } catch(error) {
    res.status(400).json({
      success: false,
      response: error
    });
  }
})

app.post("/messages", async (req, res) => {
  const {message} = req.body;
  try {
    const newMessage = await new Message({message: message}).save();
    res.status(201).json({
      success: true, 
      response: newMessage
    });
  } catch(error) {
    res.status(400).json({
      success: false,
      response: error
    });
  }
})

app.post("/messages/:id/like", async (req, res) => {
  const { id } = req.params;
  try {
   await Message.findByIdAndUpdate(id, {$inc: {like: 1}});
   res.status(200).json({success: true, response: "Message Liked"});
  } catch (error) {
   res.status(400).json({success: false, response: error});
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

