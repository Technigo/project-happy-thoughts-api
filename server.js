import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 5,
    maxlength: 140
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

const Thought = mongoose.model('Thought', thoughtSchema);

const port = process.env.PORT || 8080;
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// app.use((req, res, next) => {
//   if (mongoose.connection.readyState === 1) {
//     next();
//   } else {
//     res.status(503).json({ error: 'Service unavailable' });
//   }
// });

// Routes 
app.get('/', (req, res) => {
  res.send('Hello world');
});

app.get('/thoughts', async (req, res) => {
  try {
    const thought = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec();
    res.json(thought);
  } catch (err) {
    res.status(404).send({ err: "Page not found" });
  }
});

app.post('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save();
    res.status(201).json(newThought);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Duplicated value', fields: err.keyValue })
    }
    res.status(400).json({ message: 'Could not save your thought to the database.', error: err.errors });
  }
});

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const updateHeart = await Thought.findById(thoughtId);
    if (updateHeart) {
      // Add a heart and update the heart counter
    } 
  } catch (err) {
    res.status(400).json({ message: 'Could not find the thought in the database.', error: err.errors });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
