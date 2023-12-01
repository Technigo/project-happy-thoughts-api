require('dotenv').config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import setUpRoutes from "./Routes/Routes";
import Routes from "./Routes/Routes";
import Thought from "./models/Thought";


const mongoUrl = process.env.HAPPY_THOUGHTS_URL || "mongodb://localhost:27017/HappyThoughts"; //"mongodb://localhost/defaultdb"; // used before deploy "mongodb://localhost:27017/HappyThoughts"
console.log(`Connecting to MongoDB at ${mongoUrl}`); 
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;



//Seeding function
/*async function seedDatabase() {
  try {
    // Optionally clear existing data
   // await Thought.deleteMany({});

    // Insert seed data
    await Thought.insertMany(seedData);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}*/


// Add middlewares to enable cors and json body parsing

const app = express();
app.use(cors());
app.use(express.json());
//app.use(Routes)
setUpRoutes(app);




// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
 // seedDatabase();
});

