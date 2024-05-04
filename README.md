# Project Happy Thoughts API

This week we're building our own Happy Thoughts API using express.js, mongoose and MongoDB.

## The problem

### Requirements

- Your API should implement the routes exactly as documented in the instructions above (see [instructions.md](/instructions.md))
- Your `GET /thoughts` endpoint should only return 20 results, ordered by `createdAt` in descending order.
- Your API should validate user input and return appropriate errors if the input is invalid.
- In the `POST /thoughts` endpoint to create a new thought, if the input was invalid and the API is returning errors, it should set the response status to `400` (bad request).
- The endpoint to add hearts to a thought should return an appropriate error if the thought was not found.

## View it live

[Happy Thoughts API on Render](https://project-happy-thoughts-api-4mf8.onrender.com)
