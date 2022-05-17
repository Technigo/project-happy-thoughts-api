import "dotenv/config";
import mongoose from "mongoose";
import { setDbError } from "../middleware/dbErrorHandler.js";

const uri = process.env.MONGO_URL;
if (!uri) {
  throw new Error("cannot find MONGO_URL");
}

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export default async function startDB() {
  try {
    await mongoose.connect(uri, options, function (err) {
      if (err) throw new Error(err);
    });

    const conn = mongoose.connection;

    conn.on("connected", async function () {
      console.log("database is connected successfully");
    });
    conn.on("disconnected", function () {
      console.log("database is disconnected successfully");
    });

    conn.on("error", () => {
      console.error.bind(console, "connection error:");
      setDbError();
    });
  } catch (e) {
    console.error(`error while connect monngoose, error : ${e}`);
  }
}
