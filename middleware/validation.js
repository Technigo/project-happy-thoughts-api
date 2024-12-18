import { body, validationResult } from "express-validator";

// Validation rules for creating a thought
export const validateThought = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required.")
    .isLength({ min: 5, max: 140 })
    .withMessage("Message must be between 5 and 140 characters."),
]

// General validation handler
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};