# Project Happy Thoughts API
This project was made during the Technigo bootcamp. 
The goal was to build an API which includes both GET request endpoints to return data and POST endpoints to create data. 

I have a frontend made and you can check the final result out here: https://happy-booth-d6f66f.netlify.app/
Where i use both my own frontend and backend.

## The project
- This Express API consists of a MongoDB stored in Atlas and deployed to Heroku
- I created a mongoose model called "Thought". The model schema consists of three main components: message, hearts and createdAt. It also have several validation rules such as requiered, min/max length and default. 
- I used try and catch in all endpoints for error handling.

## Endpoints

GET /thoughts
Displays the latest 20 thoughts, sorted by createdAt to show the most recent thoughts first.

POST /thoughts
Endpoint to post and save a new thought to the database. 

POST /thoughts/:thoughId/like

## TECH 
- MongoDB
- Mongoose
- Node.js
- Express

## View it live
https://nice-thoughts-api.herokuapp.com/thoughts


