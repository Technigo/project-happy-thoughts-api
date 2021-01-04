import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Model for each message object
const Thought = mongoose.model('Thought', {
  message: String,
  hearts: Number,
  createdAt: String,
});

// Seed database
const seedDatabase = async => {
  await Message.deleteMany({});
  new.Message().save();
};

seedDatabase();

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// thoughts get route which will show a max of 20 thoughts, sorted by createdAt to show the most recent thoughts first 
app.get('/thoughts', (req, res) => {
  const thoughts = await Thought.find()
  res.json(thoughts);
});

// thoughts post route which will be used to post new thoughts to the database
app.post('/thoughts', (req, res) => {

});


// like/heart post route that will allow for a specific thought to be targeted using it's id and then post a like for that id - must include id
app.post('/thoughts/:thoughtId/like', (req, res) => {

});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
});
