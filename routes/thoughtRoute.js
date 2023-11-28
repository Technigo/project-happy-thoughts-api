import express from "express";
import ThoughtModel from "..models/Thoughts"
import listEndpoints from "express-list-endpoints";

const router = express.Router();

//All endpoints
router.get("/", (req, res) => {
    try {
        const endpoints = listEndpoints(router);
        res.json(endpoints);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router