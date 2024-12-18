import express from "express";
import { getThoughts, postThought } from "../controllers/thoughtController.js";
import { validateThought, validate } from "../middleware/validation.js";

const router = express.Router();

// Get all thoughts
router.get("/", getThoughts);

// Post a new thought
router.post("/", validateThought, validate, postThought);

export { router as thoughtRoutes };