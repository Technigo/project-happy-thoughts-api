# Project Happy Thoughts API

This is a RESTful API that I've created for my previous frontend-project "Happy Thoughts".

It consists of three endpoints:

- One for getting data from the data base
- One for posting data to the database
- One for posting a like which updates a specific object in the database

## Requirements

This project has the three endpoints mentioned above. I've also created a mongoose model for the data which is sent to the database.

The GET /thoughts endpoint has a limit of 20 results that are shown in descending order.

The user input is validated and if invalid, the user gets appropriate errormessages.

The POST /thoughts has a response status of 400 if the input is invalid.

The POST /thoughts/:id/like endpoint return a 404 if the thought is not found.

## Tech 

- Mongoose
- Node.js
- Express
- MongoDB

## View it live

<a href='https://happy-thoughts-api-emelie.herokuapp.com/'>Happy Thoughts API</a>