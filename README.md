# Project Happy Thoughts API, Week 19, Technigo Bootcamp 

Build API using Express and Mongodb including GET and POST requests. 

## The problem

Requirements: 
- create API to match the frontend project https://github.com/MarySparrow/project-happy-thoughts
- GET endpoint should only return 20 results, ordered by `createdAt` in descending order.
- API should validate user input and return appropriate errors if the input is invalid.
- In the `POST /thoughts` endpoint to create a new thought, if the input was invalid and the API is returning errors, it should set the response status to `400` (bad request).
- The endpoint to add hearts to a thought should return an appropriate error if the thought was not found.

## View it live

Heroku link: https://all-happy-thoughts.herokuapp.com/

Frontend link: https://happy-thoughts-maria-sparre.netlify.app/