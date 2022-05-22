import express from "express";
import {
  getThoughts,
  postThought,
  postLike,
  deleteThought,
} from "../controllers/thoughtsController";

const router = express.Router();

router.get("/", getThoughts);
router.post("/", postThought);
router.post("/:id/like", postLike);
router.delete("/:id", deleteThought);

module.exports = router;
