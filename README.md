# Project Happy Thoughts API

Create my own API to a previous frontend project.

## Features

The API has get, post, delete, and patch endpoints. It follows a mongoose model and schema. All endpoints are written with a try-catch-form and have error handling.

### Documentation

GET /thoughts - Returns all posted thoughts with a find() function. The posted thoughts are limited to 20, and they are displayed in a descending order based on createdAt.

POST /thoughts - Makes it possible to post a new thought to the database.

POST /thoughts/:thoughtId/like - Updates the number of likes (hearts) a posted thought get. I use findByIdAndUpdate() function. The likes increases by 1 each time.

DELETE /thoughts/:id - Makes it possible to delete a thought by using findOneAndDelete() function. Only available in the backend.

PATCH /thoughts/:id - Makes it possible to update a thought by using findOneAndUpdate(). Only available in the backend.

## The process

The goal with the project is to

- use POST requests to send data to my API
- store data from POST request
- validate data
- build a API that works with an existing frontend (that can be used by anyone).

I build a schema with a message, likes and createdAt. I started to replace the old endpoints. It was tricky to keep everything neat and clean, and I work methodically to get it done.
I chose to use async-await with try-catch block because it is easy to read and follow.

In the future I would like to implement more functions in both the backend and the frontend, making it possible to chose category's for you thoughts.

## View it live

Backend: https://happy-thoughts-maria.herokuapp.com/thoughts
Frontend: https://happy-thoughts-maria-petersson.netlify.app/
