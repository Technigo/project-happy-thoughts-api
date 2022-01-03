import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

// mongoURL is the address of my database in my local machine 
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be overridden when starting the server. For example: PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Schema: part of the Model
const MemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, //it requires a new memeber name, otherwise, mongo throws an error
    unique: true, // mongo double checks if that name already exists or not
    enum: ['Jennie', 'Matilda' , 'Karin', 'Maksymilian'],
  },
  description: {
    type: String,
    minlength: 5, //watch out lowercase
    maxlength: 10,
    trim: true, //deletes white spaces that we make by mistake
  },
  score: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
})

// Model
const Member = mongoose.model('Member', MemberSchema)


// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello Technigo! Here we go!')
})



// post request
app.post('/members', async (req, res) => {
  const { name, description } = req.body;

try {
  const newMember = await new Member({ name, description }).save();
  res.status(201).json({ response: newMember, success: true });

} catch (error) {
  res.status(400).json({ response: error, success: false });
}
});





// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
