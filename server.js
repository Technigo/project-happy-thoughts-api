import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { findConfigUpwards } from "@babel/core/lib/config/files";

// mongoURL is the address of my database in my local machine
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden when starting the server. For example: PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Schema: part of the Model
const ThoughtsSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true, 
    minlength: 5, //watch out lowercase
    maxlength: 40,
    trim: true, //deletes white spaces that user by mistake
  },

  hearts: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Number,
    default: () => Date.now(), // or default: Date.now,
    required: true,
  },

  author: {
    type: String,
    minlength: 1,
    default: "Anonymous",
  }
});

// A Model called Thought and the model must use the schema I created above called ThoughtSchema
const Thought = mongoose.model("Thought", ThoughtsSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


// --------------------- ENDPOINTS ----------------//

app.get("/", (req, res) => {
  res.send(
    "Hello everyone! I am Fatima and this is my Happy Thoughts API! Making API's is cool! -  see this API live at https://my-happy-thoughts-place.netlify.app/"
  );
});

// 1- Endpoint for the frontend to get the most recent 20 thoughts which are saved into the database 
app.get("/thoughts", async (req, res) => {

  try {
    const allThoughts = await Thought.find()
      .sort({ createdAt: "desc" })
      .limit(20);
    res.status(200).json(allThoughts);

  } catch (error) {
    res.status(404).json({
      response: error,
      success: false,
    });
  }
});

// 2- Endpoint for the frontend to post a message plus the name of the author into the database
// v1: post request using async await
app.post("/thoughts", async (req, res) => {
  const { message, author } = req.body;

  try {
    const newThought = await new Thought({ message: message, author: author|| "Anonymous",}).save();
    res.status(201).json({ response: newThought, success: true });

  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// v2: post request using promises
// app.post('/thoughts', (req, res) => {
// 	const { message} = req.body;

// 	new Thought({ message })
// 		.save()
// 		.then((data) => {
// 			res.status(201).json({ response: data, success: true });
// 		})
// 		.catch((error) => {
// 			res.status(400).json({ response: error, success: false });
// 		});
// });

// v3: post request using mongoose callback
// app.post('/thought', (req, res) => {
// 	const { message  } = req.body;

// 	new Thought({ message}).save((error, data) => {
// 		if (error) {
// 			res.status(400).json({ response: error, success: false });
// 		} else {
// 			res.status(201).json({ response: data, success: true });
// 		}
// 	});
// });


// 3- Enpoint for the frontend to increase (update) the hearts/likes
app.post("/thoughts/:thoughtsId/like", async (req, res) => {
  const { thoughtsId } = req.params;

  try {
    const updatedHeart = await Thought.findByIdAndUpdate(
      thoughtsId,
      { $inc: { hearts: 1 } },
      { new: true }
    );

    if (updatedHeart) {
      res.status(201).json({ response: updatedHeart, success: true });

    } else {
      res.status(404).json({ response: " ID not found!", success: false });
    }

  } catch (error) {
    res.status(400).json({
      message: "Can not update the heart/like",
      response: error,
      success: false,
    });
  }
});

// 4- Endpoint for the frontend to delete a specific message
app.delete("/thoughts/:thoughtId/delete", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const deletedThought = await Thought.findByIdAndDelete(thoughtId);

    if (deletedThought) {
      res.status(200).json({ response: deletedThought, success: true });

    } else {
      res.status(404).json({ response: "Message not found!", success: false });
    }

  } catch (error) {
    res.status(400).json({ message: "invalid request", response: error, success: false });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
