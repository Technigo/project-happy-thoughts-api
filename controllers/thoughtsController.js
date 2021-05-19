import Thought from '../models/thoughtsModel';
import AppError from '../utils/appError';
import APIRequest from '../utils/apiRequest';

export const createOne = async (req, res, next) => {
  try {
    const { message, category, name } = req.body;
    const doc = await Thought.create({ message, category, name });

    res.status(201).json(doc);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    // By default this returns the lastest 20 thoughts
    const request = new APIRequest(Thought.find()).sort().limit();

    const doc = await request.mongoQuery;

    res.status(200).json(doc);
  } catch (error) {
    next(error);
  }
};

export const updateOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    // This will only update the hearts in the provided thought
    const doc = await Thought.findByIdAndUpdate(
      id,
      { $inc: { hearts: 1 } },
      { new: true }
    );
    
    if (!doc) {
      return next(new AppError(404, "Not Found", "The ID you provided did not exist. Please try again"))
    }
    res.status(200).json(doc);
  } catch (error) {
    next(error);
  }
};
