import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import thoughtRoutes from "./routes/thoughtRoutes";

const mongoUrl = process.env.MONGO_URL;

// "mongodb://localhost/happy-thoughts"

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 3000;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //Cool method according to Diego

//Getting hold of the get/post-methods (routes) through the thoughtRoutes
app.use(thoughtRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
