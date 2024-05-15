# Project Happy Thoughts API

We were building our own API for our previous Happy Thoughts project.

## The problem

We were asked to create three endpoints:
1️⃣ GET/thoughts >> that should return 20 thoughts max, sorted by createdAt date, most recent thougth first.
2️⃣ POST/thoughts >> this endpoint saves a new thought to the API (if input is valid = between 5 and 140 character).
3️⃣ POST/thoughts/:thoughtId/like >> endpoint to add a heart (like) to the thought, found by id.

I used Express.js and mongoose to define the API and interact with the database.

## View it live

[Happy Thoughts API on render.](https://project-happy-thoughts-api-83nh.onrender.com)

[Happy Thoughts frontend on netlify.](https://happy-thoughts-by-eliane.netlify.app)
