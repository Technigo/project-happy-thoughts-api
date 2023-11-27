const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URL || 'mongodb://localhost/Happy';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  // We're connected!
  console.log('Connected successfully to MongoDB');
});

module.exports = db;
