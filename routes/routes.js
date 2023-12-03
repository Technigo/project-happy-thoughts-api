import express from "express";
import {
  getThoughtsController,
  addThoughtController,
  getOneThoughtController,
  addHeartController,
} from "../controller/thoughtController";

//Start defining your routes here

const router = express.Router();
//--- GET /thoughts ---
//Endpoint should return a maximum of 20 thoughts
router.get("/thoughts", getThoughtsController);

//--PUT Find specific thought, and update its hearts property to add one heart
// i.e http://localhost:8080/thoughts?656a1edf191e5afe6f4bf3f0
router.get("/thoughts/:thoughtId", getOneThoughtController);

//--- POST /thoughts ---
router.post("/thoughts", addThoughtController);

//--PUT Find specific thought, and update its hearts property to add one heart
router.put("/thoughts/:thoughtId/like", addHeartController);

export default router;
