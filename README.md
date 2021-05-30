# Project Happy Thoughts API

In week 19 of the Technigo Front End Bootcamp the assignment was to use Express and Mongo DB to build an API that include both GET request endpoints and POST endpoints to create data.

## The problem

The fundamental idea is for it to be an API used for a pervious frontend project called Happy Thoughts - a twitter like site focusing on positivity and friendliness where the user can post own thoughts, and read and like thoughts from others.

General requirements:

- The API should implement the routes GET /thoughts, POST /thoughts and POST /thoughts/thoughtId/like
- The GET /thoughts endpoint should only return 20 results, ordered by createdAt in descending order.
- The API should validate user input and return appropriate errors if the input is invalid.
- In the POST /thoughts endpoint to create a new thought, if the input was invalid and the API is returning errors, it should set the response status to 400 (bad request).
- The endpoint to add hearts to a thought should return an appropriate error if the thought was not found.

At this current state I am in the process of connecting this API to the existing frontend project, I am really looking forward to see the full circle of the frontend and backend code - for the first time both of which I have created!

I have saved some unused and commented out code in this project for future reference – as I would like to add more of the methods for additional features, like deleting and editing a posted thought.

The API is deployed to Heroku and the database is deployed using Mongo Cloud.

## View it live

Link to API: https://is-happy-thoughts.herokuapp.com/
Link to API endpoint of thoughts: https://is-happy-thoughts.herokuapp.com/thoughts
Link to fullstack project: TBC
