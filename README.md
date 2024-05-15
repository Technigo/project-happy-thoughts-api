# Project Happy Thoughts API

The assignment was to building your own API to replace the existing one used in the Happy Thoughts React project. The new API should have the functionality of the original, including routes for fetching, adding, and liking thoughts, while ensuring input validation and error handling.

## The problem

I managed errors, validated input, connected to MongoDB, documented endpoints, set up Express routes, used environment variables and added basic logging. 

My GET /thoughts endpoint is returning 20 results, ordered by createdAt in descending order. I also have the function to show ascending but it's not added in the frontend.

The POST /thoughts endpoint creates a new thought and if the input is invalid it will return error (400).

The endpoint will add hearts to a thought should return an error if the thought is not found.

## View it live

API: https://project-happy-thoughts-api-qgyf.onrender.com/

Frontend: https://celebrated-shortbread-0673ce.netlify.app/
