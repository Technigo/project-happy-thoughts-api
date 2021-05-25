# Project Happy Thoughts API

The assignment was to create a backend including a REST-API using Mongoose and MongoDB. The API is then used in my previous Happy Thought frontend-project.

## The problem

To solve the problem I used:
- MongoDB as data storage
- Mongoose to define the document structure in the database
- Mongo Cloud Atlas for database hosting
- Heroku for backend server hosting
- MongoDB Compass for testing
- Postman for testing

Endpoints: 
- GET /thoughts
    - gets the 20 most recent thoughts, sorted in descending order (new thought on top)
- POST /thoughts
    - posts a new thought. Requirements are min 4 characters and max 140 in one message, and the value must be unique. 
- POST /thoughts/:id/like
    - increases the amount of likes/hearts by 1 on the thought with the provided _id.
- DELETE /thoughts/:id
    - deletes the thought with the provided _id.

If I had more time I would experiment with more features that would require changes in the frontend to really understand how FE and BE is connected.  

## View it live

Backend deployed on Heroku: 
https://happy-thoughts-finder.herokuapp.com/

Frontend deployed on Netlify: 
https://epic-euler-f992c6.netlify.app/