import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

const MemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, 
    enum: ['Jennie', 'Matilda', 'Karin', 'Maksymilian']
  },
  description: {
    type: String,
    minlength: 5,
    maxlength: 10,
    trim: true
  },
  score: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Number,
    default: () => Date.now()
  }
})

const Member = mongoose.model('Member', MemberSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
});

// v1 - async await
// app.post('/members', async (req, res) => {
//   const { name, description } = req.body;

//   //success
//   try {
//     const newMember = await new Member({  name, description }).save();
//     res.status(201).json({ response: newMember, succes: true });
//   //if something goes wrong (doesn't match the schema)
//   } catch (error) {
//     res.status(400).json({  response: error, success: false });
//   }

// });


// v2 - promises
// app.post('/members', (req, res) => {
//   const { name, description } = req.body;

//   new Member({ name, description }).save()
//     .then(data => {
//       res.status(201).json({ response: data, success: true })
//     })
//     .catch(error => {
//       res.status(400).json({ response: error, success: false });
//     })
// });

// v3 - mongoose callback
app.post('/members', (req, res) => {
  const { name, description } = req.body;

  new Member({ name, description })
    .save((error, data) => {
      if (error) {
        res.status(400).json({ response: error, success: false });
      } else {
        res.status(201).json({ response: data, success: true });
      }
    });
});



// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})

