import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happy-thoughts';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app));
});

app.get('/happy-thoughts', async (req, res) => {
  const thought = await Thought.find()
    .sort({ createdAt: 'desc' })
    .limit(20)
    .exec();
  res.status(201).json(thought);
});

app.post('/happy-thoughts', async (req, res) => {
  const { message, clicks } = req.body;

  const thought = new Thought({ message, clicks });

  try {
    const savedThought = await thought.save();
    res.status(200).json(savedThought);
  } catch (err) {
    res.status(400).json({
      message: 'Could not save your happy thought to the Database ',
      error: err.errors,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
