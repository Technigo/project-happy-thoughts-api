import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => Date.now()
  }
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: 'Service unavailable' });
  }
});

app.get('/endpoints', (req, res) => {
  res.send(listEndpoints(app));
});

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find({})
    .sort({ createdAt: -1 })
    .limit(20)
    .exec();
  res.status(200).json({ response: thoughts, success: true });
});

app.post('/thoughts', async (req, res) => {
  const { message } = req.body;

  try {
    const newThought = await new Thought({ message }).save();
    res.status(201).json({ response: newThought, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        $inc: {
          hearts: 1
        }
      },
      {
        new: true
      }
    );
    if (updatedThought) {
      res.status(200).json({ response: updatedThought, success: true });
    } else {
      res.status(404).json({ response: 'Thought not found', sucess: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, sucess: false });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// TODO 1.
// error om servern inte funkar, som damien visade i ett tidigare projekt.

// TODO 2.
// → Should not be assignable when
// creating a new thought.
// For example, if I send a POST
// request to / to create a new
// thought with this JSON body;
// { "message": "Hello", "hearts": 9000 },
// then the hearts property should be
//  ignored, and the object we store
// in mongo should have 0 hearts.
