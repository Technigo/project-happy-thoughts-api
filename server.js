import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';
import thoughtRoutes from './routes/thoughtRoutes'; // Import the routes

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/test";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

// Use the thoughtRoutes
app.use('/api', thoughtRoutes);

app.get("/api-docs", (req, res) => {
    try {
        const endpoints = listEndpoints(app);
        res.json(endpoints);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
