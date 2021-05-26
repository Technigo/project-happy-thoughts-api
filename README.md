<!-- @format -->

# Project Happy Thoughts API

In this week's project I used Express and Mongodb to build an API of "happy thoughts" which includes both POST request endpoints to allow the user to enter a "happy thought" and also GET endpoints to return the collection of "happy thoughts".

This url will be implemented in the frontend project which is Twitter-like app:
https://github.com/dannuzak/project-happy-thoughts

## What I learned

How to use POST requests to send data to my API
How to store data in my database from POST requests
How to validate data and ensure my database only contains 'good' data

## Tech I used

Express :: Mongo DB :: Mongoose :: Atlas :: Heroku :: Postman :: Compass

## How I built it

1. I first created a model and schema for each new thought. This schema contains Mongoose validators so the user can only enter valid and 'good' data.
2. Then I created a serie of endpoints using Mongoose functions.
3. For error handling I implemented the try & catch combination in all endpoints.
4. I replaced Technigo's API url with my own API url.

## Documentation - CORE ROUTES

List of endpoints of this API: https://my-happythoughts-api.herokuapp.com/

### GET /thoughts

A GET endpoint that will display the whole collection of thoughts listing the most recent thought on top.

### POST /thoughts

This POST endpoint will allow the user to enter a new thought that will be stored in MongoDB.

### POST /thoughts/:id/likes

A POST endpoint that will allow to increase the amount of likes.

### DELETE /thoughts/:id

A DELETE endpoint that will make possible to delete a thought by id.

## View it live

Backend deployment:
https://my-happythoughts-api.herokuapp.com/

Frontend deployment:
https://happy-thoughts-by-dannuzak.netlify.app/
