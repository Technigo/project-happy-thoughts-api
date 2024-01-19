import mongoose from "mongoose";

const { Schema } = mongoose;
const crypto = require("crypto");

export const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      minlength: 5,
    },
    password: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      default: () => crypto.randomBytes(128).toString("hex"),
    },
    // posts: {
    //     type: String
    // }
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("users", userSchema);
