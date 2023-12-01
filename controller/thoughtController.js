import { ThoughtsModel } from "../model/ThoughtsModel";
import asyncHandler from "express-async-handler";

// desciption: Get 20 latest thoughts
// route: /thoughts
// access: Private
export const getThoughtsController = asyncHandler(async (req, res) => {
  await ThoughtsModel.find()
    .limit(20)
    .sort({ createdAt: -1 })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

// desciption: ADD Thoughts
// route: /thoughts
// access: Private
export const addThoughtController = asyncHandler(async (req, res) => {
  const thought = req.body.thought;
  await ThoughtsModel.create({
    thought: thought,
  })
    .then((result) => res.json(result))
    .catch((error) => res.status(400).json({ error: "Input was invalid" }));
});

// desciption: PUT/PATCH a specific task to give like
// route: /update/:id"
// access: Private

export const addHeartController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  await ThoughtsModel.findByIdAndUpdate({ _id: id })
    .then((result) => res.json(result))
    .catch((error) => res.json({ error: "Item not found" }));
});
