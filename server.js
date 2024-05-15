import cors from "cors";
import express, { response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { validationResult, body } from "express-validator";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const bodyParser = require('body-parser')

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())

//create Schema
const Schema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0,
    immutable: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
})

// create model
const Thoughts = mongoose.model('Thoughts', Schema)

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

//post endpoints OBS EJ KLAR! EJ ENL MITT PROJEKT
app.post('/blabla', async (req, res) => {
  const { alla saker som ska vara i schemat som är i modellen} = req.body
  try {
    const blabla = await new BLABLA ({saker som ska vara i }).save()
    res.status(201).json({
      success: true,
      response: blblbl,
      message: 'blablabla'
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: 'bkababb couldnt be created'
    })
  }
})

//patch endpoint (samma namn som post), ändra något specifikt i det som postats
app.patch('/blabla/:id', async (req, res) => {
  const { id } = req.params 

  const { det som ska uppdateras } = req.body

  try {
    const blblbl = await blablabla(modellen).findByIdAndUpdate(id,(hitta) { vad vi ska uppdatera ex name: newName }(uppdatera), {new: true, runValidators: true}(uppdatera även i postman!!))

    res.status(200).json({
      success: true,
      reponse: blblbl,
      message: "blalala updated" eller `blablab uptated to ${blablablbaa}`
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      reponse: blblbl,
      message: "blalala updated" 
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
