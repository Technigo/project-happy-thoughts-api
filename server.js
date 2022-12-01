import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

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
  try {
    res.status(200).json({
      success: true,
      message: "Happy Thoughts API",
      data: listEndpoints(app)
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      response: err
    })
  }
});

const ThoughtSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
});

const Thought = mongoose.model("Thought", ThoughtSchema);

// This will provide a response with the latest 20 created thoughts sorted descending using createdAt
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find({}).sort({ createdAt: "desc" }).limit(20)
    res.status(200).json({ success: true, response: thoughts })
  } catch (err) {
    res.status(400).json({ success: false, response: err })
  }
});

// This will allow to post a message if it pass the validation from the Schema.
// It also makes it possible to add a username. It has to be unique
app.post("/thoughts", async (req, res) => {
  const { message, userName } = req.body;
  try {
    const newThought = await new Thought({ message: message, userName: userName }).save();
    res.status(201).json({ success: true, response: newThought });
  } catch (err) {
    res.status(400).json({ success: false, response: err })
  }
});

// This will allow the possibility to implement a "like" functionality
app.patch("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const heartsToUpdate = await Thought.findByIdAndUpdate(thoughtId, { $inc: { hearts: 1 } });
    res.status(200).json({ success: true, response: `The number of hearts has been updated. Total hearts: ${heartsToUpdate.hearts + 1}` });
  } catch (err) {
    res.status(400).json({ success: false, response: err });
  }
});

////
// PAGINATION

// app.get("/thoughts", async (req, res) => {
// V1 mongoose //
// const { page, perPage } = req.query;
// try {
//   const thoughts = await Thought.find({}).sort({ createdAt: -1 }).skip((page - 1) * perPage).limit(perPage);
//   res.status(200).json({ success: true, response: thoughts });
// } catch (err) {
//   res.status(400).json({ success: false, response: err });
// }

// V2 mongo // Is going to work besides we have mongoose or not.
//   const { page, perPage, numberPage = +page, numberPerPage = +perPage } = req.query;
//   try {
//     const thoughts = await Thought.aggregate([
//       {
//         $sort: {
//           createdAt: -1
//         }
//       },
//       {
//         $skip: (numberPage - 1) * perPage
//       },
//       {
//         $limit: numberPerPage
//       }
//     ]);
//     res.status(200).json({ success: true, response: thoughts });
//   } catch {
//     res.status(400).json({ success: false, response: err });
//   }
//   // http://localhost:8080/members?page=2&perPage=1
// });

// Delete always by ID
app.delete("/thoughts/:id", async (req, res) => {
  // Delete removes entry and returns the removed one
  // Remove removes entry and returns true/false
  const { id } = req.params;
  try {
    const deletedThought = await Thought.findOneAndDelete({ _id: id });
    if (deletedThought) {
      res.status(200).json({ success: true, response: deletedThought });
    } else {
      res.status(404).json({ success: false, response: "Not found" });
    }
  } catch (err) {
    res.status(400).json({ success: false, response: err });
  }
});

// Nesting Schemas

// const TestSchema = new mongoose.Schema({
//   testProperty: {
//     type: String,
//   },
//   secondTestProperty: {
//     type: Number,
//     default: 8
//   }
// });
// const SuperSchema = new mongoose.Schema({
//   superTestProperty: {
//     type: String,
//   },
//   superSecondTestProperty: {
//     type: Number,
//     default: 8
//   },
//   lalala: {
//     type: TestSchema,
//     required: true
//   }
// });

// const SuperModel = mongoose.model("SuperModel", SuperSchema);
// const superObject = new SuperModel({
//   superTestProperty: "superTestProperty",
//   superSecondTestProperty: 9,
//   lalala: {
//     testProperty: "testProperty",
//     secondTestProperty: ""
//   }
// });
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
