import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
// copy this url and paste in mongo compass as connection string. The end of the url is the name of our database "happyThoughts" in this case
// will have connection when we save the first item
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

const thoughtSchema = new mongoose.Schema({
  //three fields for each schema
  message: {
    type: String,
    required: [true, "Message is required"], //overrides default error message. 
    unique: true,
  //   // enum: ['Hello', 'Sweet', 'Goodbye']  //always is array. Can only send these values
  //   match: /^[^0-9]+$/, //not accepting numbers in message
  //   validate: {
  //     validator: () => {
  //       //can do a lot of custom things here
  //       return /^[^0-9]+$/.test(value) //returns true/false
  //     },
  //     message: "Numbers are not allowed"
  //   },
    minlength: 5,
    maxlength: 60,
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

const Thought = mongoose.model('Thought', thoughtSchema)

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

//create post request (can have get request with same name but not problem for mongoose/express when its different methods)
app.post('/thoughts', async (req, res) => {

 try {
    // const { message } = req.body 
  // console.log(message)
  const newThought = await new Thought(req.body).save()
  res.json(newThought)
  //try in postman. hearts and createdAt is hard coded. Specifiy in schema instead
 } catch (error) {
   if (error.code === 11000){
     res.status(400).json({ error: "Duplicated value", fields: error.keyValue})
   }
    res.status(400).json(error)
 }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})


// npm install @babel/helper-compilation-targets