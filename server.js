import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "Message is required"], // Du kan göra så på samtliga, text på unique etc etc där du kan skriva ett meddelande
    unique: true,  // /^[0-9]+$/ Detta betyder att vi endast accepterar siffror
    //match: /^[^0-9]+$/,   // /^[^0-9]+$/ Detta betyder att vår input inte får innehålla siffror. Oavsett om vi bara skriver siffror eller text+siffra
    validate: {
      validator: (value) => {
        return /^[^0-9]+$/.test(value); // Vi gör så att ifall vi använder siffror så får vi ett meddelande som vi skrivit nedan att nummer ej tillåtna 
      },
      message: "Numbers are not allowed"
    },
    minlength: 5,
    maxlength: 140
  },  
  hearts: {
    type: Number,
    default:0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Thought = mongoose.model('Thought', thoughtSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.post('/thoughts', async (req,res) => {
  try {
    const newThought = await new Thought(req.body).save(); // req.body är samma sak som {message: req.body.message}
    res.json(newThought);
  } catch (error) {
    if(error.code===11000){
      res.status(400).json({ error: 'Duplicated valye', field: error.keyValue })
    }
    res.status(400).json(error)

  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
