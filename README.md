# Project Happy Thoughts API

In the Happy Thoughts project, you built a frontend in React which uses an API we created to store thoughts. For this project, we want you to build your own API which works in the same way and should become a drop-in replacement for the API you used in the React frontend.
> Now you have used Mongo to store data and set up express endpoints to fetch data, it's time to expose endpoints to your users to allow them to POST data to your API and then use that data to save new objects in your Mongo database
> 

## What you will learn

✓ How to use POST requests to send data to your API

✓ How to store data in your database from POST requests

✓ How to validate data and ensure your database only contains 'good' data

✓ How to build a full API which includes handling of user input

✓ How to build an API which works well with an existing frontend

✓ Unit tests: What they are and how to run them

## The problem

✔️ **Brief**

This week's project is to use your new skills with Express and MongoDB to build an API which includes both GET request endpoints to return data and POST endpoints to create data.

**What you need to do**

✓ Your API should implement the routes exactly as documented in the [Instructions about the project](https://www.notion.so/Week-15-Happy-Thoughts-API-d15d4bdb5aa34bef98ab94ca610895de).

✓ Your `GET /thoughts` endpoint should only return 20 results, ordered by `createdAt` in descending order.

✓ Your API should validate user input and return appropriate errors if the input is invalid.

✓ In the `POST /thoughts` endpoint to create a new thought, if the input was invalid and the API is returning errors, it should set the response status to `400` (bad request).

✓ The endpoint to add hearts to a thought should return an appropriate error if the thought was not found.


I used text instead of message, I used likes instead of hearts and I changed the id likes from post to patch in the findbyidand update. I changed some things in the frontend bc of this.

## View it live
backend:

https://project-happy-thoughts-api-kukr2tatlq-lz.a.run.app

endpoints:
  {
    "path": "/",
    "method": "get"
  },
  {
    "path": "/thoughts",
    "method": "get"
  },
  {
    "path": "/thoughts",
    "method": "post"
  },
  {
    "path": "/thoughts/:id/like",
    "method": "patch"
  }

  frontend:
  
  https://animated-pony-c38874.netlify.app/
