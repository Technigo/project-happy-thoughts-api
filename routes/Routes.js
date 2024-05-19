import express, { response } from "express";
import listEndpoints from "express-list-endpoints";
import HappyThought from "../model/Happythoughts";
const router = express.Router();

// get 20 happy thoughts
router.get("/thoughts", async (req, res) => {
  try {
    const happyThoughts = await HappyThought.find()
      .sort({ createdAt: "desc" })
      .limit(20)
      .exec();
    res.json(happyThoughts);
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Could not get thoughts",
    });
  }
});

//post new happy thought
router.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  try {
    const newHappyThought = await new HappyThought({ message }).save();
    res.status(201).json(newHappyThought);
  } catch (error) {
    console.error(error); // Log the error
    res.status(400).json({
      success: false,
      response: error,
      message: "Could not save thought",
    });
  }
});

//post a like to a happy thought
router.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const updatedThought = await HappyThought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    );
    if (updatedThought) {
      res.json(updatedThought);
    } else {
      res.status(404).json({
        success: false,
        response: error,
        message: "Thought not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Could not save like",
    });
  }
});

//delete a happy thought
router.delete("/thoughts/:thoughtId", async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const deletedThought = await HappyThought.findByIdAndDelete(thoughtId);
    if (deletedThought) {
      res.json(deletedThought);
    } else {
      res.status(404).json({
        success: false,
        response: error,
        message: "Thought not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Could not delete thought",
    });
  }
});

//filter happy thoughts by limit or skip or both
router.get("/thoughts/q", async (req, res) => {
  const { limit, page } = req.query;
  const thoughts = await HappyThought.find()
    .sort({ createdAt: "desc" })
    .limit(parseInt(limit))
    .skip(parseInt(page))
    .exec();
  res.json(thoughts);
});

// get updated documentation
router.get("/", (req, res) => {
  try {
    const endpoints = listEndpoints(router);
    const updatedEndpoints = endpoints.map((endpoint) => {
      if (endpoint.path === "/thoughts/q") {
        return {
          path: endpoint.path,
          methods: endpoint.methods,
          queryParameters: [
            {
              name: "limit",
              description:
                "filter the thoughts by the number of thoughts you want to get Example: /thoughts/q?limit=5  you could also combine limit and skip Example: /thoughts/q?limit=5&page=5",
            },
            {
              name: "page",
              description:
                "filter the thoughts by the number of thoughts you want to skip Example: /thoughts/q?page=5  you could also combine limit and skip Example: /thoughts/q?limit=5&page=5",
            },
          ],
        };
      }
      return {
        path: endpoint.path,
        methods: endpoint.methods,
      };
    });
    res.json(updatedEndpoints);
  } catch (error) {
    // If an error occurred, create a new error with a custom message
    const customError = new Error(
      "An error occurred while fetching the endpoints"
    );
    res.status(404).json({
      success: false,
      response: error,
      message: customError.message,
    });
  }
});

router.get("/pages", async (req, res) => {
  const limit = Number(req.query.limit) || 20; // default limit to  if not provided

  try {
    const count = await HappyThought.countDocuments(); // replace Thought with your model
    const totalPages = Math.ceil(count / limit);

    res.json({ totalPages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.use("/", (req, res) => {
  res.send(listEndpoints(router));
});

export default router;
