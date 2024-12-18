import express from "express";
import { postLike } from "../controllers/likeController.js";

const router = express.Router();

// Like a thought
router.post("/:id/like", postLike);

export { router as likeRoutes };