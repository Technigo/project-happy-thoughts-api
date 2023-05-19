import express from "express";
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
const listEndpoints = require('express-list-endpoints')


// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Mongoose model for the input-data
const { Schema } = mongoose;
const ThoughtsSchema = new Schema ({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 500
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
})

const Thoughts = mongoose.model("Thoughts", ThoughtsSchema)

// if (process.env.RESET_DB) {
// 	const seedDatabase = async () => {
//     await Thoughts.deleteMany({})

// 		data.forEach((thoughtsData) => {
// 			new Thoughts(thoughtsData).save()
// 		})
//   }

//   seedDatabase()
// }

// Start defining your routes here
// Show all the endpoints for the API
app.get("/", (req, res) => {
  res.json(listEndpoints(app));
});

// GET to show the list with thoughts/messages
app.get("/thoughts", async (req, res) => {
  try {
    const thoughtList = await Thoughts.find()
    .sort({ 
      createdAt: "desc" }).limit(20).exec();
    res.status(200).json({
      success: true,
      response: thoughtList,
      message: "Success"
    });
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "Could not fetch list"
    });
  }
});

// // POST to send new thought/message
// app.post('/thoughts', (req, res) => {
//   //Promises
//   const { message, createdAt } = req.body
//   const newThought = new Thoughts({ message, createdAt}).save()
// .then ((newThought) => {
//   res.status(201).json({
//     success: true,
//     response: newThought,
//     message: "Success"
//   })
// })
// .catch((e) => {
//   res.status(400).json({
//     success: false,
//     response: e,
//     message: "Could not send thought"
//   })
// })
// })

app.post("/thoughts", async (req, res) => {
  const { message, createdAt } = req.body

  try {
    const newThought = await new Thoughts({message, createdAt}).save()
    res.status(201).json({
      success: true,
      response: newThought,
      message: "Success"
    });
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "Could not post thought"
    });
  }
});


// PATCH to update the likes based on the ID
app.patch("/thoughts/:thoughtId/like", async (req, res) => {
  const { id } = req.params

  try {
    const heartUpdate = await Thoughts.findByIdAndUpdate(id, {$inc: { hearts: 1 }})
    res.status(200).json({
      success: true,
      response: heartUpdate,
      message: "Added heart"
    })
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "Did not update"
    })
  }
})
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
