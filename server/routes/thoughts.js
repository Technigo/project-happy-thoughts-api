import express from "express";

import { getThoughts, addThought, addLikes } from "../controllers/thoughts.js";

const router = express.Router();

router.get("/", getThoughts);
router.post("/", addThought);

router.post("/:id/like", addLikes);

export default router;