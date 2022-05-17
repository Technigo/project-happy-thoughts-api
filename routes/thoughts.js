import express from "express";

import thoughts from "../controllers/thoughts.js";

const router = express.Router();

router.get("/", thoughts.getThoughts);

router.post("/", thoughts.addThought);

module.exports = router;