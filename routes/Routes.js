import express from "express";
import listEndpoints from "express-list-endpoints";
import HappyThought from "../model/Happythoughts";
const router = express.Router();

// get 100 last happy thoughts
router.get("/thoughts", async (req, res) => {
  try {
    const happyThoughts = await HappyThought.find()
      .sort({ createdAt: "desc" })
      .limit(100)
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
        message: "Thought not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
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
        message: "Thought not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Could not delete thought",
    });
  }
});

//filter happy thoughts by limit or skip or both
router.get("/thoughts/q", async (req, res) => {
  const { limit = 10, page = 1 } = req.query; // Provide default values for limit and page
  const skip = (parseInt(page) - 1) * parseInt(limit); // Correctly calculate skip

  try {
    const thoughts = await HappyThought.find()
      .sort({ createdAt: "desc" })
      .limit(parseInt(limit))
      .skip(skip) // Skip documents that have already been fetched
      .exec();
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/pages", async (req, res) => {
  const limit = Number(req.query.limit) || 5; // default limit to  if not provided

  try {
    const count = await HappyThought.countDocuments(); // replace Thought with your model
    const totalPages = Math.ceil(count / limit);

    res.json({ totalPages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get updated documentation
router.get("/", (req, res) => {
  try {
    const endpoints = listEndpoints(router);
    const updatedEndpoints = endpoints.map((endpoint) => {
      switch (endpoint.path) {
        case "/thoughts":
          return {
            path: endpoint.path,
            methods: endpoint.methods,
            description:
              "Get the last 100 happy thoughts or post a new happy thought.",
          };
        case "/thoughts/q":
          return {
            path: endpoint.path,
            methods: endpoint.methods,
            description: "Filter happy thoughts by limit or skip or both.",
            queryParameters: [
              {
                name: "limit",
                description:
                  "Limit the number of thoughts returned. Default is 5. example: /thoughts/q?limit=10. you can also use /thoughts/q?limit=5&page=2 to get the second page of 5 thoughts.",
              },
              {
                name: "page",
                description:
                  "Paginate through thoughts based on limit. Default is 1. example: /thoughts/q?limit=5&page=2. ",
              },
            ],
          };
        case "/thoughts/:thoughtId/like":
          return {
            path: endpoint.path,
            methods: endpoint.methods,
            description: "Post a like to a happy thought.",
          };
        case "/thoughts/:thoughtId":
          return {
            path: endpoint.path,
            methods: ["DELETE"],
            description: "Delete a happy thought.",
          };
        case "/pages":
          return {
            path: endpoint.path,
            methods: endpoint.methods,
            description:
              "Get the total number of pages of happy thoughts. Example: /pages.",
          };
        default:
          return {
            path: endpoint.path,
            methods: endpoint.methods,
          };
      }
    });
    res.json(updatedEndpoints);
  } catch (error) {
    const customError = new Error(
      "An error occurred while fetching the endpoints"
    );
    res.status(404).json({
      success: false,
      message: customError.message,
    });
  }
});

export default router;
