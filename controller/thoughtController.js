import { ThoughtsModel } from "../model/ThoughtsModel";
import expressAsyncHandler from "express-async-handler";

// desciption: Get Thoughts
// route: /thoughts
// access: Private
export const getThoughtsController = expressAsyncHandler(async (req, res) => {
  await ThoughtsModel.find()
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

// desciption: ADD Thoughts
// route: /thoughts
// access: Private
export const addThoughtController = expressAsyncHandler(async (req, res) => {
  const thought = req.body.thought;
  await ThoughtsModel.create({
    thought: thought,
  })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

// desciption: PUT/PATCH a specific task to give like
// route: /update/:id"
// access: Private

export const addHeartController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  await ThoughtsModel.findByIdAndUpdate({ _id: id })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});
