import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import thoughtsRouter from "./routes/thoughtsRoutes.js"; // Make sure this path matches your file structure
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-happy-thoughts';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', thoughtsRouter); 

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
