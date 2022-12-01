# Project Happy Thoughts API

Build an API, with Express and MongoDB, which includes GET request endpoints to return data and POST/PATCH endpoints to create/edit data.

## The problem

Since there already was a frontend created to which this API was supposed to be used, the endpoints and mongoose models/schemas needed to be made with this in mind.
The assignment was that:
- The GET endpoint should only return 20 results, ordered by `createdAt` in descending order.
- The API should validate user input and return appropriate errors if the input is invalid.
- The POST endpoint to create a new thought, if the input was invalid and the API is returning errors, it should set the response status to `400` (bad request).
- The PATCH endpoint to add hearts to a thought should return an appropriate error if the thought was not found.
- I edited the frontend to make sure the user can't submit invalid data

## View it live

Backend:  https://project-happy-thoughts-api-4ooljqxwgq-lz.a.run.app 
Frontend: https://linnea-happy-thoughts-api-frontend.netlify.app/
