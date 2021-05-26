<!-- @format -->

# Project Happy Thoughts API

In this week's project I used Express and Mongodb to build an API of "happy thoughts" which includes both POST request endpoints to allow the user to enter a "happy thought" and also GET endpoints to return the collection of "happy thoughts".

## What I learned

How to use POST requests to send data to my API
How to store data in my database from POST requests
How to validate data and ensure my database only contains 'good' data

## Tech I used

Express
Mongo DB
Mongoose
Atlas
Heroku
Postman
Compass

## How I built it

1. I first created a model and schema for each new thought. This schema contains Mongoose validators so the user can only enter valid and 'good' data.
2. In order for the user to enter a new thought that will be stored in MongoDB, I created a POST endpoint using Mongoose functions.
3. There is also a GET endpoint that will display the whole collection of thoughts in ascendant order.
4. A DELETE endpoint will make possible to delete a thought by id.
5. For error handling I implemented try and catch in all endpoints

## View it live

https://my-happythoughts-api.herokuapp.com/
