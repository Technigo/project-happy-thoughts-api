import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

const Member = mongoose.model('Member', {
  name: {
    type: String,
    required: false,
    unique: false,
    /* enum: ['Jennie', 'Matilda', 'Karin', 'Maksymilian'], */
  },
  description: {
    type: String,
    minlength: 5,
    maxlength: 10,
    trim: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world');
});

app.post('/members', async (req, res) => {
  const { name, description } = req.body;
  try {
    // den enda anledningen till att man skulle vilja spara den nya medlemmen till en variabel är om man vill sända vidare infon till the frontend. kanske som en konfirmation.
    const newMember = await new Member({ name, description }).save();
    res.status(201).json({ response: newMember, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
