# Project Happy Thoughts API

The project was to work with Express and Mongodb to build an API which includes both GET request endpoints to return data and POST endpoints to create data. The API should later on be used as a database for the project-happy-thoughts frontend project done a couple of weeks earlier.

## The problem

I started to build a `Thought` Mongoose model which has properties for the `message` string, a `heart` property for tracking the number of likes, and a `createdAt` property to store when the thought was added. Then I added three different endpoints: 
`GET /thoughts` returns a maximum of 20 thoughts, sorted by `createdAt` to show the most recent thoughts first.
`POST /thoughts` expects a JSON body with the thought `message`. If the input is valid, the thought should be saved, and the response should include the saved thought object, including its `_id`.
`POST thoughts/:thoughtId/like` is for given a valid thought id in the URL, the API should find that thought, and update its `hearts` property to add one heart.

## Learning objectives 🧠

- How to build a full API which includes handling of user input
- How to include error handling to return good validation errors
- How to build an API which works well with an existing frontend

## View it live

https://stayhappy.netlify.app/
