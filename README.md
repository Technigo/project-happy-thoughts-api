# Project Happy Thoughts API

This is the backend API for a project called "Happy Thoughts," which allows users to post and like positive thoughts. The goal is to create a simple and uplifting platform for sharing joy.

## The problem

The project involves building a backend server using Node.js, Express, and MongoDB to handle the storage and retrieval of positive thoughts. The provided code includes routes for getting all thoughts, posting new thoughts, and liking existing thoughts.

## Approach
Project Structure: The code is organized into different files for better maintainability. There's a models folder for defining the Mongoose model, a routes folder for handling different API endpoints, and the main server.js file to tie everything together.

Database: MongoDB is used as the database, and Mongoose is employed as an ODM (Object Data Modeling) library to interact with the database.

Route Handling: Express.js is utilized to create routes that handle various HTTP requests. For example, there are routes to get all thoughts, post a new thought, and like a thought.

Error Handling: There's error handling in place using try-catch blocks to ensure that if something goes wrong, the server responds with the appropriate status code and error message.

## Technologies Used

Node.js
Express.js
MongoDB (with Mongoose)
CORS (Cross-Origin Resource Sharing)

## View it live

https://api-happy-thought.onrender.com/ 
