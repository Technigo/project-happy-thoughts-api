import { ThoughtModel } from "../models/Thought";
import asyncHandler from "express-async-handler";

export const getThoughtsController = asyncHandler(async (req, res) => {
  await ThoughtModel.find()
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

export const addThoughtController = asyncHandler(async (req, res) => {
  const thought = req.body.thought;

  await ThoughtModel.create({
    thought: thought,
  })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

export const updateThoughtController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);

  await ThoughtModel.findByIdAndUpdate({ _id: id })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

export const deleteAllThoughts = asyncHandler(async (req, res) => {
  await ThoughtModel.deleteMany({})
    .then((result) =>
      res.json({
        message: "All happy thoughts deleted. The world is a darker place",
        deletedCount: result.deletedCount,
      })
    )
    .catch((err) => res.json(err));
});

export const deleteThought = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await ThoughtModel.findByIdAndDelete(id)
    .then((result) => {
      result
        ? res.json({
            message: "Thought deleted successfully",
            deletedThought: result,
          })
        : res.status(404).json({
            message: "Thought not found",
          });
    })
    .catch((err) => res.status(500).json(err));
});
