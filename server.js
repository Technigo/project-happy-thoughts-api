// Import delle librerie necessarie
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import expressListEndpoints from 'express-list-endpoints';

// Caricamento delle variabili d'ambiente
dotenv.config();

// Connessione al database MongoDB
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-happy-thoughts';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

// Schema Mongoose per il modello Thought
const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Thought = mongoose.model('Thought', thoughtSchema);

// Inizializzazione dell'app Express
const app = express();
const port = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Definizione delle route
app.get('/', (req, res) => {
  res.json({
    message: 'Happy Thoughts API',
    endpoints: expressListEndpoints(app),
  });
});

// GET /thoughts - Ottiene i 20 pensieri più recenti
app.get('/thoughts', async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json(thoughts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching thoughts', error });
  }
});

// POST /thoughts - Crea un nuovo pensiero
app.post('/thoughts', async (req, res) => {
  const { message } = req.body;

  if (!message || message.length < 5 || message.length > 140) {
    return res.status(400).json({ message: 'Invalid message length' });
  }

  try {
    const newThought = new Thought({ message });
    const savedThought = await newThought.save();
    res.status(201).json(savedThought);
  } catch (error) {
    res.status(500).json({ message: 'Error saving thought', error });
  }
});

// POST /thoughts/:thoughtId/like - Incrementa i cuori di un pensiero per ID
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: 'Thought not found' });
    }

    res.status(200).json(thought);
  } catch (error) {
    res.status(500).json({ message: 'Error liking thought', error });
  }
});

const thoughtId = '668989b29e009559a9281952'; // Esempio di ID del pensiero
fetch(`http://localhost:10000/thoughts/${thoughtId}/like`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));


// Gestione degli errori globali
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Avvio del server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
