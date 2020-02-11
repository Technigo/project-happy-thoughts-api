import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import compression from 'compression';
import logger from 'morgan';
import { errors } from 'celebrate';
import Routes from './routes/index';
import Thought from './models/thought';

dotenv.config();

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts';

try {
  mongoose.connect(mongoUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
} catch (error) {
  console.log(error);
}

mongoose.Promise = Promise;

if (process.env.RESET_DB === 'true') {
  const resetDatabase = async () => {
    await Thought.deleteMany();

    for (let i = 0; i < 40; i++) {
      const newThought = new Thought({
        message: `Message ${i}`
      });
      newThought.save();
    }
  };
  resetDatabase();
  console.log('Database cleared and seeded with new data!');
}

const port = process.env.PORT || 8080;
const app = express();

// Middlewares
app.use(compression());
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world');
});

// Catch errors thrown by Celebrate
app.use(errors());

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
