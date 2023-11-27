const express = require("express");

const thoughtsController = require("../controllers/thoughtsControllers");

const router = express.Router();

router
  .route("/thoughts")
  .get(thoughtsController.getThoughts)
  .post(thoughtsController.createThought);

router.route("/thoughts/:thoughtId/like").put(thoughtsController.postLikes);

module.exports = router;
