# Project Happy Thoughts API

In week 15, we got to build our own back-end for our 'Happy Thoughts'-project for which we build the front-end back in week 7, and hook them up together. 

## The brief

This week's project is to use your new skills with Express and MongoDB to build an API which includes both GET request endpoints to return data and POST endpoints to create data.

**What you need to do**

✓ Your API should implement the routes exactly as documented in the instructions about the project.

✓ Your `GET /thoughts` endpoint should only return 20 results, ordered by `createdAt` in descending order.

✓ Your API should validate user input and return appropriate errors if the input is invalid.

✓ In the `POST /thoughts` endpoint to create a new thought, if the input was invalid and the API is returning errors, it should set the response status to `400` (bad request).

✓ The endpoint to add hearts to a thought should return an appropriate error if the thought was not found.

## View it live

Back-end: https://project-happy-thoughts-api-sfjig4oswa-lz.a.run.app/
Front-end: https://hilarious-concha-fcce10.netlify.app/
