import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true, 
    minlength: 5,
    maxlength: 140
  },
  name: {
    type: String,
    default: 'Anonymous'
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now
  }
});

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Thought.deleteMany();
    await Thought.forEach((thought) => {
      new Thought(thought).save();
    });
  };
  seedDatabase();
};

const port = process.env.PORT || 9000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: 'Service unavailable' });
  };
});

app.get('/', async (req, res) => {
  const thoughts = await Thought.find()
    .sort({createdAt: 'desc'})
    .limit(20);
  res.json(thoughts);
});

app.post('/', async (req, res) => {
  try {
    const { message, name } = req.body;
    const thought = new Thought({ message, name })
    const savedThought = await thought.save();
    res.status(200).json(savedThought);
  } catch (err) {
    res.status(400).json({error: 'Could not save thought to the Database', errors:err.errors});
  }
});

app.post('/:thoughtId/like', async (req, res) => {
  try {
    const { thoughtId } = req.paramas
    await Thought.updateOne({ _id: thoughtId }, { $inc : {hearts: 1} }).save();
    res.status(201).json();
  } catch (err) {
    res.status(400).json({error: 'Could not save like to the Database', errors:err.errors});
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
