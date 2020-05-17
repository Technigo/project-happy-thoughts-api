import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise
mongoose.set('useCreateIndex', true)

const Thought = mongoose.model('Thought', {
    message:{
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
      default: Date.now
    }
  })


// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

//Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// This endpoint should return a maximum of 20 thoughts, 
// sorted by createdAt to show the most recent thoughts first
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(thoughts)
})

//This point expects a json body with the message like {message:"hello"}
//If the thought is valid it should be saved and should include _id 
app.post('/thoughts', async (req, res) => {
  const { message } = req.body
  const thought = new Thought({ message })
  try {
    //Sucess
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    // Failed
    res.status(400).json({ message: 'Could not send thought', error: err.errors })
  }
 })


//Dont require a json body.Given a valid thought id in the url, 
//the API should find that thought, and update its hearts property to add one heart.
app.post('/:thoughtId/like', (req, res) => {
  res.send('Hello world')
})
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})














// POST REQUEST
// const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/notes"
// mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
// mongoose.Promise = Promise

//  POST REQUEST
//  const Note = mongoose.model('Note', {
//   text: String,
//   createdAt:{
//     type: Date,
//     default: () => new Date()
//   }
// })

//   // ********************POST REQUEST****************************************
//   app.post('/notes', async (req, res) => {
//   const { text } = req.body
//   const note = new Note ({ text })
//   await note.save()
//   res.json(note)
// })



// ERROR & VALIDATION
// const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/validationScreencast"
// mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
// mongoose.Promise = Promise

// const Person = mongoose.model('Person', {
//   name: {
//     type: String,
//     required: true,
//     minlength: 2,
//     maxlength: 500
//   },
//   height: {
//     type: Number,
//     required: true,
//     min: 5
//   },
//   birthdate: {
//     type: Date,
//     default: Date.now
//   }
// })

// TRYING OUT VALIDATION
//  new Person({name:'Me', height:150}).save()

// ***************ERROR & VALIDATIONS*********************************************
// app.post('/people', async (req,res) => {
//   new Person (req.body).save()
//   .then((person) => {
//     res.status(200).json(person)
//   })
// .catch ((err) =>{
//   res.status(400).json({message: 'Could not save person', errors: err.errors})
// })
  // NEDANSTÅENDE KOD = OVANSTÅENDE KOD
  // 
  // try {
  //   // Sucess case
  //   const person = await new Person(req.body).save()
  //   res.status(200).json(person)
  // } catch (err) {
  //   res.status(400).json({message: 'could not save person', errors: err.errors})
  // }
  // // const person = new Person(req.body)
  // // const savedPerson = await person.save()
  // // res.json(savedPerson) 
// })
// ***************VANS CODEALONG*********************************************
  // CODEALONG 
//   const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/post-codealong"
// mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
// mongoose.Promise = Promise


// const Task = mongoose.model("Task", {
//   text:{
//     type: String,
//     require:true,
//     minlength:5
//   },
//   complete: {
//     type: Boolean,
//     default: false
//   },
//   createdAt:{
//     type: Date,
//     default: Date.now
//   }
// })
// app.get('/tasks', async (req, res) => {
//   const tasks = await Task.find().sort({createdAt:'desc'}).limit(20).exec()
//   res.json(tasks)
// })
// app.post('/tasks', async (req, res) => {
//   // retrieve info sent by client to our API endpoint
//   const {text, complete} = req.body
  
//   //use our mongoose model to create the database entry
//   const task = new Task({text,complete})

//   try {
//   // Success
//     const savedTask = await task.save()
//     res.status(201).json(savedTask)
//   }catch (err) {
//   //Bad request
//     res.status(400).json({message:'Could not save task to the database', error: err.errors})
//   }
// })