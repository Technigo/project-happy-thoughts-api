import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

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
    maxlength: 140
  },
  heart: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => Date.now()
  }
});

app.get('/thoughts', async (req, res) => {
  const {
    page,
    perPage,
    pageNum = Number(page),
    perPageNum = Number(perPage)
  } = req.query;

  const thoughts = await Thought.find({})
    .sort({ createdAt: 1 })
    .skip((pageNum - 1) * perPageNum);
  res.status(200).json({ response: thoughts, success: true });
});

app.use(cors());
app.use(express.json());

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
