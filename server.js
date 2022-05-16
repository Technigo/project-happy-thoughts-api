import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const TechnigoMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum:["Karin", "Petra", "Matilda", "Poya", "Daniel"]
  },

  description: {
    type: String,
    minlength: 4,
    maxlength: 30,
    // Deletes whitespace from beginning and end of a string (but no spaces between words)
    trim: true
  }, 

  score: {
    type: Number,
    default: 0,
  },
  
  createdAt: {
    type: Date,
    // Anonymous function for the function to run for every new POST and not only when the application starts
    default: () => new Date()
  } 
})

const TechnigoMember = mongoose.model('TechnigoMember', TechnigoMemberSchema)

// Codealong with VAN
// const Task = mongoose.model('Task', {
//   text: {
//     type: String,
//     required: true,
//     minlength: 5
//   },
//   complete: {
//     type: Boolean,
//     default: false
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   } 
// })

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

// Async await POST - prefered verion
app.post('/members', async (req, res) => {
  const { name, description } = req.body
  console.log(req.body)
  try {
    const newMember = await new TechnigoMember({name: name, description: description}).save()
    // status 201 = created
    res.status(201).json({response: newMember, success: true})
  } catch (error) {
    res.status(400).json({response: error, success: false})
  }
})

// Does not work
app.post('members/:id/score', async (req, res) => {
  const { id } = req.params
  try {
    const memberToUpdate = await TechnigoMember.findByIdAndUpdate(id, {$inc: {score: 1}})
    res.status(200).json({response: `Member ${memberToUpdate.name} has been updated`, success: true})
  } catch (error) {
    res.status(400).json({response: error, success: false})
  }
})

// POST with promises
// app.post('/members',  (req, res) => {
//     const { name, description } = req.body
//     new TechnigoMember({name: name, description: description}).save()
//    .then(data => {
//         //status 201 = created
//       res.status(201).json({response: data, success: true})
//    })
//     .catch (error => {
//       res.status(400).json({response: error, success: false})
//     })
//   })


// Version 3
  // app.post('/members',  (req, res) => {
  //   const { name, description } = req.body
  //   new TechnigoMember({name: name, description: description}).save((error, data) => {
  //     if (error) {
  //       res.status(400).json({response: error, success: false})
  //     } else {
  //       res.status(201).json({response: data, success: true})
  //     }
  //   })
  // })
  

// Codealong with VAN
// app.get('/tasks', async (req, res) => {
//   const tasks = await Task.find().sort({createdAt: 'desc'}).limit(20).exec()
//   res.json(tasks)
// })

// app.post('/tasks', async (req, res) => {
//   const { text, complete } = req.body
//   const task = new Task({text, complete})

//   try{
//     const savedTask = await task.save()
//     res.status(201).json(savedTask)
//   }catch (err){
//     res.status(400).json({message: 'Could not save task to the database', error: err.errors})
//   }
// })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
