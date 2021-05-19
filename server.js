import express from 'express'
import cors from 'cors'
import mongoose, { get } from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    reguired: [true, 'Message required'],
    // unique: true,
    minlength: 5,
    maxlength: 140,
    // lowerCase: true,
    // enum: [' Ylva is best', 'Ylvas is super']
    //regualar  expression, Regex: match:. Don't accept numbers /^[^0-9]+$/. Only accept numbers /^[0-9]+$/.
    // match:/^[^0-9]+$/
    // validate:{
    //   validator: (value) => {
    //     return /^[^0-9]+$/.test(value);
    //   },
    //   message: 'Number are not allowed'
    // },
  },
  hearts:{
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Thought = mongoose.model('Thought',thoughtSchema);

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/thoughts', async (req, res)=> {
  try{
    
    const thoughts = await Thought.find()
    const sortThoughts = thoughts.sort(
    (a,b) => b.createdAt -a.createdAt
    );

    const newestThoughts = sortThoughts.slice(0, 19);
    res.json(newestThoughts)

  } catch (error){

    res.status(404).json(error);
  }

})

//This endpoint expects a JSON body with the thought `message`, like this: `{ "message": "Express is great!" }`. If the input is valid (more on that below), the thought should be saved, and the response should include the saved thought object, including its `_id`.
app.post('/thoughts', async (req, res) => {
  try {
      const newThought = await new Thought(req.body ).save()
    res.json(newThought);
  } catch(error) {
    if (error.code === 11000){
      res.status(400).json({ error: 'Duplicated value', filed: RTCError.keyValue});
    }
    res.status(400).json(error);
  }
})

//This endpoint doesn't require a JSON body. Given a valid thought id in the URL, the API should find that thought, and update its `hearts` property to add one heart.
app.post('/thoughts/:thoughtId/like', async (req, res)=> {
  const { thoughtId } = req.params;
  try {
    await Thought.updateOne({ _id: thoughtId }, { $inc: { hearts: 1 } });
    res.status(201).send();
  } catch (err) {
    res.status(400).send({ message: NOT_FOUND });
  }
});

app.listen(port, () => {

  console.log(`Server running on http://localhost:${port}`)
})
