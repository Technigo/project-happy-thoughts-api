// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes'); // Assumi che il file si chiami routes.js
const Thought = require('./models/Thought'); // Ensure this matches the exact file casing
const thoughtsData = require('./data/thoughtsData'); // Assumi il percorso corretto ai dati di esempio

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log("MongoDB connected successfully");

  // Inserisci i dati di esempio nel database solo se non ci sono pensieri già presenti
  const count = await Thought.countDocuments();
  if (count === 0) {
    await Thought.insertMany(thoughtsData);
    console.log("Inserted initial thoughts data into the database");
  }
})
.catch((err) => {
  console.error("MongoDB connection error:", err.message);
  process.exit(1); // Exit process with failure
});

// Mount the routes under /api
app.use('/api', routes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
