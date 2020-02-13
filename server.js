import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

const Thought = mongoose.model('Thought', {

  message: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 140
  },
  hearts: {
    type: Number
  },
  createdAt: {},
  posted:{
    type
  }

})

// if (process.env.RESET_DB) {
//   const seedDatabase = async () => {
//     await Thought.deleteMany({})

//     .forEach((thoughtRecord) => {
//       new Thought(thoughtRecord).save()
//     })
//   }

//   seedDatabase()
// }

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})
// How to make a route where you post your new messages? 


// When you want to update a message: 
// 1) Get the message that you want to update (by id)
// 2) Change the part of the message that you want to update


// app.get('/thoughts/posted')
app.get('/messages', (req, res) =>{
  const queryString = req.query.q
  const queryRegex = new RegExp (queryString, "i")
  Thought.find({'message':queryRegex, 'createdAt': })
  .sort({'num_pages': -1})
  .limit(20)
  .then((results)=> {
    // succesfull
    req.send(results)
  }).catch((err)=>{
    //error/ failure
    console.log('Error'+ err)
    res.json(null)
  })
  
})
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
