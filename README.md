# Project Happy Thoughts API

This week we're building our own Happy Thoughts API using express.js, mongoose and MongoDB.

## The problem

This assignment, too, was pretty straight forward. Following the instructions and looking back on past to weeks made solving this rather painless.

Again, I opted for using "app.route().method()" to group the methods for the respective routes - I just think it looks cleaner.

### Next

- I might add some queries for filtering
- pagination
- Stretch goals suggest adding categories, tags and user names
- I wonder I how can prevent others from using my API and filling up my database... maybe it's next week Authentication?

### Requirements

- Your API should implement the routes exactly as documented in the instructions above (see [instructions.md](/instructions.md))
- Your `GET /thoughts` endpoint should only return 20 results, ordered by `createdAt` in descending order.
- Your API should validate user input and return appropriate errors if the input is invalid.
- In the `POST /thoughts` endpoint to create a new thought, if the input was invalid and the API is returning errors, it should set the response status to `400` (bad request).
- The endpoint to add hearts to a thought should return an appropriate error if the thought was not found.

## View it live

[Happy Thoughts API on Render](https://project-happy-thoughts-api-4mf8.onrender.com)
