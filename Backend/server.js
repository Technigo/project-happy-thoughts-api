import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  mongoose.connection.readyState === 1
    ? next()
    : res.status(503).json({ error: "Service Unavailable" });
});

app.use(taskRoutes);

app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
