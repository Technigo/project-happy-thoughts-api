import express from "express";
import { getThoughts, postThought } from "../controllers/thoughtController.js";

const router = express.Router();

// Get all thoughts
router.get("/", getThoughts);

// Post a new thought
router.post("/", postThought);

export { router as thoughtRoutes };