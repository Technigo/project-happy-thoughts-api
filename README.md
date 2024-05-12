# Project Happy Thoughts API

This project aims to create a RESTful API using Express.js and MongoDB to manage and retrieve "happy thoughts" messages. Users can post their happy thoughts, view all happy thoughts, and like specific thoughts.

## The problem

To address this assignment, I utilized Express.js for defining the API endpoints and mongoose to interact with the MongoDB database. The approach involved planning the data schema for happy thoughts and implementing CRUD operations accordingly. Middleware like cors and express.json was incorporated to handle CORS and parse JSON request bodies efficiently.

The project includes the following endpoints:

- **GET /thoughts**: Fetches the latest 20 happy thoughts.
- **POST /thoughts**: Creates a new happy thought.
- **POST /thoughts/:thoughtId/like**: Likes a specific happy thought.

If I had more time, I would focus on implementing features such as user authentication to allow users to post and like thoughts securely.

## View it live

The API is deployed on Render. You can access it [here](https://project-happy-thoughts-api-vdc8.onrender.com).
