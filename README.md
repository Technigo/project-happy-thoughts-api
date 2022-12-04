# Project Happy Thoughts API

API for saving Thoughts

## The problem

Handle validation and updates of the thoughts database using Mongoose and MongoDB.

## Routes

### `GET /thoughts`

This endpoint returns a maximum of 20 thoughts, sorted by `createdAt` 

### `POST /thoughts`

This endpoint created a new thought and expects a JSON body with the thought `message`, like this: `{ "message": "Express is great!" }`.

### `POST /thoughts/:thoughtId/like`

This endpoint increments the likes of a thought.

## View it live

Browse the API on this url: https://project-happy-thoughts-api-j7vhqcm4aq-lz.a.run.app

Or browse the React UI at https://happythoughtsproject.netlify.app/