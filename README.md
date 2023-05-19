# Project Happy Thoughts API
This project is a RESTful API for a simple Twitter-like app named "Happy Thoughts", which allows users to post, view, and like messages. It was built using Node.js, Express, MongoDB and deployed on Heroku.

# The Problem
The main challenge of this project was designing an API that allows users to post messages, retrieve a list of the latest messages, and like a specific message. The API provides several routes for these actions.

# Technologies used:
Node.js
Express
CORS
Mongoose
MongoDB
Render

# Features:
Post a new message
Retrieve a list of the 20 latest messages
Like a specific message

# MongoDB Schema:
A message (or thought) in the database is defined with the following properties:

message: A string that is required, should be between 5 and 140 characters and trimmed.
hearts: A number representing the likes on the message, defaults to 0.
createdAt: A date representing when the message was created, defaults to the current date.

# Endpoints:
/ - Index route with a welcome message
/thoughts - GET route to retrieve the 20 latest messages, POST route to post a new message
/thoughts/:thoughtId/like - POST route to like a specific message

# How to run the API locally:
Clone the repository
Install dependencies with npm install
Make sure MongoDB is installed and running
Run the server with npm start
Access the API at http://localhost:8080

# API Deployed on Render:
https://project-happy-thoughts-api-t716.onrender.com/

# The API is also connected to a React Frontend:
https://happy-thoughts-feed.netlify.app/
