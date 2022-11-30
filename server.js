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

const person = new mongoose.Schema({ // allowing us to create a object, below the description/type
  name: {
    type: String, // type , madatory , most important
    required : true, // providing a name mandatory
    unique : true, // new name have to be diff than all others from the database
    enum : ['Ben', 'Jerry', 'Donald Duck' , 'Hercules'] // takes an array of values
  },
  description : {
    type: String,
    minlength : 4,
    maxlength : 30,
  }
  })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
