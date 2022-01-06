# Project Happy Thoughts API

In this project I am creating the backend of my own Twitter version, which is focussing on positiviy. It's called the "Happy thoughts API". I used Express and Mongodb to build an API which includes both GET request endpoints to return existing happy thoughts and POST endpoints to create data like new happy thoughts or increase likes on existing thoughts.

The API will be communicating with a frontend I was building in an earlier project (https://nehrwein-happy-thoughts.netlify.app/).

## Description

I have created the following endpoints:
- GET '/' - start
- GET '/endpoints' - provides all endpoints
- GET '/thoughts' - endpoint returns a maximum of 20 thoughts, sorted by the time of creation to show the most recent thoughts first.
- POST '/thoughts' - endpoint for posting new Happy Thoughts. Possibility to add categories and the author's name.
- POST ':thoughtId/like' - endpoint to increase the amount of likes on each individual thought


Learnings:
- How to use POST requests to send data to the API
- How to store data in the database from POST requests
- How to validate data and ensure the database only contains 'good' data
- How to build a full API which includes handling of user input
- How to build an API which works well with an existing frontend

## View it live

Visit my deployed API here https://nehrwein-happy-thoughts-api.herokuapp.com

Documentation: https://documenter.getpostman.com/view/18068162/UVXdNe6K

Link to the frontend website https://nehrwein-happy-thoughts.netlify.app/
