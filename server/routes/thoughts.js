import express from "express";

import thoughts from "../controllers/thoughts.js";

const router = express.Router();

router.get("/", thoughts.getThoughts);
router.post("/", thoughts.addThought);

router.post("/:id/like", thoughts.addLikes);

module.exports = router;