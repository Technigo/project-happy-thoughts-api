import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/validationScreencast";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Create model for mongo database
const Person = mongoose.model('Person', {
  name:{
    type: String,
    required: true,
    minlength: 2,
    maxlength: 500 
  }, 
  height:{
    type: Number,
    required: true,
    min: 5
  },
  birthdate:{
    type: Date,
    default: Date.now
  }
})

new Person({name: "Van", height: 150}).save()

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.post('/people', async (req, res) => {
  // Promises
  new Person(req.body).save()
  .then((person) => {
    res.status(200).json(person)
  })
  .catch((err) => {
    res.status(400).json({message: 'Could not save person', errors: err.errors})
  })

  
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
