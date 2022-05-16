import express, { application } from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


const Task = mongoose.model('Task', {
  text: {
    type: String,
    required: true,
    minlength: 5
  },
  complete: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


// ----------------------/START-------------------------- //
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// ----------------------/GET TASKS-------------------------- //
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(tasks)
})


// ----------------------/POST TASKS------------------------ //
app.post('/tasks', async (req, res) => {
  // Retrieve the information sent by the client to our API endpoint
  const {text, complete} = req.body

  // Use our mongoose model to create the database entry
  const task = new Task({text, complete})

  try {
    // Success case
    const savedTask = await task.save()
    res.status(201).json(savedTask)
  } catch (err) {
    res.status(400).json({message: 'Could not save task to the database', error: err.errors})
  }
})

// ----------------------/UPDATE SCORE------------------------ //
app.post("/tasks/:id/score", async (req, res) => {
  const { id } = req.params

  try {
    const memberToUpdate = await TechnigoMember.findByIdAndUpdate(id, {$inc: {score: 1}})
    res.status(200).json({response: `Member ${memberToUpdate.name} has been updated`, success: true})
  } catch (error) {
    res.status(400).json({response: error, success: false})
  }
})

// ----------------------/START SERVER------------------------ //
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
