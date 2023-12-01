import { Express } from "express";

//Start defining your routes here

const router = express.Router();
//--- GET /thoughts ---
//Endpoint should return a maximum of 20 thoughts
router.get("/thoughts", getThoughtsController);

//--- POST /thoughts ---
router.post("/thoughts", addThoughtController);

//--POST Find specific thought, and update its hearts property to add one heart
router.post("/thoughts/:thoughtId/like", addHeartController);

export default router;
