import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const mongoUrl = process.env.MONGO_URL 
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// var bodyParser = require('body-parser')
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

const ChatSchema = new mongoose.Schema({ // allowing us to create a object, below the description/type
  name: {
    type: String, // type , madatory , most important
    required: true, // providing a name mandatory
    unique: true, // new name have to be diff than all others from the database
    enum: ["Ben", "Jerry", "Donald Duck", "Hercules"] // takes an array of values
  },
  description: { // main block of happy thought
    type: String,
    minlength: 4,
    maxlength: 30,
    trim: true, // removes unnecessary whitespace
  },
  score: {
    type: Number,
    default: 0
  }, 
  createdAt: {
    type: Date,               // on default you can do logic with anonymous function on Schemas () =>
    default: () => new Date() // executing once we run the server. if you want to call it immediately,(for req info too): (()=> new Date)() or like this (function functioName () {new DAte()})()
  }
  })

  const Person = mongoose.model("Person", ChatSchema)

  app.post("/chat", async (req, res) => {
    const {name, description} = req.body // ex. "name": "Maria" => terminal gives output
    console.log(req.body)
    try {
      const newInput = await new Person({ name: name , description: description}).save()
      res.status(201).json({ success: true, response: newInput }) // 201 created success
    } catch (error) {
      res.status(400).json({ success: false, response: error })
    }
  })

  app.patch("/chat/:id/score", async (req, res) => {
    const { id } = req.params
    try {
      const update = await Person.findByIdAndUpdate(id, {$inc: {score: 1}})
      res.status(200).json({ success: true, response: `Member ${update.name}`})
    } catch (error) {
      res.status(401).json({ success: false, response: error})
    }
  })

  // Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



/********** Different options for syntax *******/

// Mongoose syntax style
/*app.post("/chat", (req, res) => {
  const {name, description} = req.body // ex. "name": "Maria" => terminal gives output

  const newInput = new Person({ name: name, description: description}).save((error, data) => {
    if (error) {
      res.status(400).json({ success: false, response: error })
      console.log("No")
    } else {
      res.status(201).json({ success: true, response: data }) // 201 created success
      console.log("")
    }
  })  
})*/

//Promises syntax
/*app.post("/chat", (req, res) => {
  const {name, description} = req.body
  const newInput = new Person({ name: name , description: description}).save()
  .then(data => {
    res.status(201).json({ success: true, response: data })
    console.log("Work")
  })
  .catch(error => {
    res.status(400).json({ success: false, response: error})
    console.log("Nope")
  })
})*/

//POST => create stuff
//PUT => replace
//PATCH => modify/change

