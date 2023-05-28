import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";
import listEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/final-project-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(
  cors({
    origin: "http://localhost:8080", 
    methods: ["GET", "POST"], // Specify the allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify the allowed headers
  })
); 
app.use(express.json());

// Defines endpoint paths as constants to be able to only update the paths in one place if needed
const PATHS = {
  root: "/",
  register: "/register",
  login: "/login",
  secrets: "/secrets",
  sessions: "/sessions"
}

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex")
  }
});

const User = mongoose.model("User", UserSchema);

// Registration
app.post(PATHS.register, async (req, res) => {
  const { name, password } = req.body;

  try {
    const salt = bcrypt.genSaltSync();
    // Do not store plaintext passwords
    const newUser = await new User({
      name: name,
      password: bcrypt.hashSync(password, salt)})
    .save();
    res.status(201).json({
      success: true,
      response: {
        name: newUser.name,
        id: newUser._id,
        accessToken: newUser.accessToken
      }
    })
  } catch (e) {
    // Bad request
    res.status(400).json({
      success: false,
      response: e,
      message: 'Could not create user', 
      errors: e.errors
    });
  }
});
// Login
app.post(PATHS.login, async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({name: name})
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({
        success: true,
        response: {
          name: user.name,
          id: user._id,
          accessToken: user.accessToken
        }
      });
    } else {
      res.status(400).json({
        success: false,
        response: "Credentials do not match"
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      response: e
    });
  }
});

// Authenticate the user
const authenticateUser = async (req, res, next) => {
  const accessToken = req.header("Authorization");
  try {
    const user = await User.findOne({accessToken: accessToken});
    if (user) {
      next();
    } else {
      res.status(401).json({
        success: false,
        response: "Please log in",
        loggedOut: true
      })
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      response: e
    });
  }
}

// Authenticate the user and return the secret message
app.get(PATHS.secrets, async (req, res) => {
  const accessToken = req.header("Authorization");
  try {
    const user = await User.findOne({ accessToken: accessToken });
    if (user) {
      const secretMessage = "This is the secret page! Woop woop";
      res.status(200).json({ secret: secretMessage });
    } else {
      res.status(401).json({
        success: false,
        response: "Please log in",
        loggedOut: true,
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      response: e,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Test in postman

// Post: http://localhost:8080/register 
// {
//   "name": "enter new name",
//   "password": "enter password"
// }

// Post: http://localhost:8080/login
// {
//     "name": "name",
//     "password": "password"
// }

// Get   http://localhost:8080/secrets
// Headers: Authorization
// Enter accessToken in value

// Post: http://localhost:8080/sessions
// {
//     "name": "name",
//     "password": "password"
// }


