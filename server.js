import express, { json } from "express";
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

/////////////////////////
const TechnigoMemberSchema = new mongoose.Schema({
  name: {
    // Most important ine
    type: String,
    // Forced to provide this value. Default value is "false"
    required: true,
    // New name will have to be different than all others in the database
    unique: true,
    // An array of all the allowed values. Only these five names are allowed in the database. Should not be used everywhere.
    enum: ["Matilda", "Poya", "Petra", "Hanna", "Daniel"],
  },
  description: {
    type: String,
    minlength: 4,
    maxlength: 30,
    // Removes unneccessary whitespaces
    trim: true,
  },
  score: {
    type: Number,
    // Initial value if none other is specified
    default: 0,
  },
  createdAt: {
    type: Date,
    // new Date() will execute once - when we start the server. It is not being called when creating the person but when the database starts.
    // default: new Date()
    // onClick = {new Date()}
    // IIFE - in the moment you call the function it it executed right away
    // default: (() => new Date())()
    // function is not called right away.
    default: () => new Date(),
  },
});

const TechnigoMember = mongoose.model("TechnigoMember", TechnigoMemberSchema);

// Version 1
// app.post("/members", async (req, res) => {
//   const { name, description } = req.body;
//   console.log(req.body);
//   try {
//     const newMember = await new TechnigoMember({
//       name: name,
//       description: description,
//     }).save();
//     res.status(201).json({
//       success: true,
//       response: newMember,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       response: error,
//     });
//   }
// });

//Version 2 POST with promises
app.post("/members", (req, res) => {
  const { name, description } = req.body;

  const newMember = new TechnigoMember({ name: name, description: description })
    .save()
    .then((data) => {
      res.status(201).json({ success: true, response: data });
    })
    .catch((error) => {
      res.status(400).json({ success: false, response: error });
    });
});

// Version 3 POST mongoose sytnax
// app.post("/members", (req, res) => {
//   const { name, description } = req.body;

//   const newMember = new TechnigoMember({
//     name: name,
//     description: description,
//   }).save((error, data) => {
//     if (error) {
//       res.status(400).json({
//         success: false,
//         response: error,
//       });
//     } else {
//       res.status(201).json({
//         success: true,
//         response: data,
//       });
//     }
//   });
// });

// Update score <3
// POST => create stuff, put thing into the database
// GET => get info
// PUT => replace in DB -> one person switch with another
// PATCH => change/modify in DB

app.patch("/members/:id/score", async (req, res) => {
  const { id } = req.params;
  const memberToUpdate = await TechnigoMember.findByIdAndUpdate(id, {
    $inc: { score: 1 },
  });
  try {
    res.status(200).json({
      success: true,
      response: `Member ${memberToUpdate.name} has their score updated`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
    });
  }
});

/////////////////////////

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
