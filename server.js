import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import compression from 'compression';
import logger from 'morgan';
import { errors, celebrate, Joi, Segments } from 'celebrate';
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

    for (let i = 0; i < 1; i++) {
      const newThought = new Thought({
        message: `Happy thought #${i + 1}`
      });
      newThought.save();
    }
  };
  resetDatabase();
  console.log('Database cleared and seeded with new data!');
}

const port = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(compression());
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());

// Middleware to check if API service is available
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({
      error: 'Service unavailable'
    });
  }
});

// Validate all incoming request headers for the user-agent JSON header
// If missing or not the correct format, respond with an error
// app.use(
//   celebrate({
//     [Segments.HEADERS]: Joi.object({
//       'Content-Type': Joi.any()
//         .valid('application/json')
//         .required()
//     }).unknown()
//   })
// );

// Load API routes
app.use('/api', Routes);

// Catch errors thrown by Celebrate
app.use(errors());

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
