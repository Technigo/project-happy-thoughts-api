import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/HappyApi";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());



const happySchema = new mongoose.Schema({
  hearts: {
    type: Number,
    default: 0
  },

  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  thoughtsId: {
    type: Number
  }
});

const AllUsermessages = mongoose.model("AllUsermessages", happySchema);

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Welcome to this API");
});

/* GET/ message
This endpoint should return a maximum of 20 messages, sorted by createdAt to show the most recent messages first. */

app.get("/thoughts", async (req, res) => {
  const message = await AllUsermessages.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();

  try {
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

/* POST/message
This endpoint expects a JSON body with the message message, like this: { "message": "Express is great!" }.
If the input is valid (more on that below),
the message should be saved, and the response should include the saved message object, including its \_id. */

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  const messages = new AllUsermessages({ message });

  try {
    const saveAllUsermessages = await messages.save();
    res.status(201).json(saveAllUsermessages);

  } catch (error) {
    res
      .status(400)
      .json({ response: "could not save your thought", success: false });
  }
});

/* 

POST /thoughts/:thoughtsId/like
This endpoint doesn't require a JSON body. Given a valid message id in the URL, the API should find that message,
and update its hearts property to add one heart.

 */

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const likeUpdate = await AllUsermessages.findByIdAndUpdate(
      {
        _id: thoughtId
      },
      {
        $inc: {
          hearts: 1
        }
      },
      {
        new: true
      }
    );

    if (likeUpdate) {
      res.json(likeUpdate);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
