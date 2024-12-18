# Project Happy Thoughts API

This is a backend API for the Happy Thoughts app, built using Express.js, MongoDB (via Mongoose), and CORS. 

The app allows users to post, retrieve, and like "thoughts" (messages), which are stored in a MongoDB database.

## Features
Post Thoughts: Users can submit a message (between 5 to 140 characters) to create a new thought.

Like Thoughts: Users can "like" a thought, which increases the "hearts" count for that particular thought.

Get Thoughts: Users can retrieve the latest 20 thoughts, sorted in descending order by creation date.

CORS Support: The API allows cross-origin requests from a specific frontend hosted on Netlify (https://post-happy-thoughts.netlify.app).

## Technologies Used
Node.js: Backend runtime environment.

Express.js: Web framework for building the API.

MongoDB: NoSQL database used to store thoughts and related data.

Mongoose: MongoDB object modeling tool.

dotenv: For managing environment variables.

CORS: Cross-origin resource sharing to allow specific domains to interact with the API.

## API Endpoints

GET /thoughts: Retrieves the 20 most recent thoughts.

POST /thoughts: Submits a new thought with a message.

POST /thoughts/:id/like: Likes a thought by incrementing the hearts count.


## View it live
project-happy-thoughts-api-production-5d1d.up.railway.app


