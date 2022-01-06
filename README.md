# Week 19 - Technigo Bootcamp

# Project Happy Thoughts API
This week's project is to use your new skills with Express and Mongodb to build an API which includes both GET request endpoints to return data and POST endpoints to create data.
In order to replace the API we built, you're going to need to build a `Thought` Mongoose model which has properties for the `message` string, a `heart` property for tracking the number of likes, and a `createdAt` property to store when the thought was added.

Then, you'll need to add 3 endpoints:

### `GET /thoughts`
This endpoint should return a maximum of 20 thoughts, sorted by `createdAt` to show the most recent thoughts first.

### `POST /thoughts`
This endpoint expects a JSON body with the thought `message`, like this: `{ "message": "Express is great!" }`. If the input is valid (more on that below), the thought should be saved, and the response should include the saved thought object, including its `_id`.

### `POST thoughts/:thoughtId/like`
This endpoint doesn't require a JSON body. Given a valid thought id in the URL, the API should find that thought, and update its `hearts` property to add one heart.

This api is connected with the frontend of [project-happy-thoughts](https://project-happy-thougths.netlify.app/) and works smoothly.

## The problem
To develop this week approach I followed the videos about how to use sort and limit operations from database. I applied mongoose validation to some parts of the schema and also default value for date. Finally the backend and frontend build in this course was conected. 

## View it live
See: https://project-happy-thoughts-backend.herokuapp.com/
