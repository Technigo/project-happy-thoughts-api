# Project Happy Thoughts API

In this project I created my own API which replaced an API used in a Frontend project already created. It is a Twitter-like API but with only Happy Thoughts. It is possible to GET the last 20 Happy Thoughts, to POST new Happy Thoughts and to POST likes on Happy Thougths. 

## The problem

Describe how you approached to problem, and what tools and techniques you used to solve it. How did you plan? What technologies did you use? If you had more time, what would be next?

I created an API using Express and the database MongoDB. The API includes three endpoints, one with a GET request and two with POST requests. 

In this project I started by creating the mongoose model for Thougths including `message`, `hearts` and `createdAt` and setting validation rules to the parameters. 

For the endpoints, I first created the `GET` endpoint getting the last 20 Happy Thoughts, by finding the thoughts, sorting them by date in descending order and then limit to 20 thoughts.

Then I created the `POST` request for posting new Happy Thoughts with a message. Last I created the `POST` request for liking thoughts by increasing the number of hearts. For making this work I used the mongoose-method `updateOne` which first finds the right ID and then increase the hearts. 

I have added error handlers to all endpoints to get a clear error message if the request is not following the validation rules. 

## Learning Objectives

- How to build a full API which includes handling of user input

- How to include error handling to return good validation errors

- How to build an API which works well with an existing Frontend

## Tech

- Node.js

- MongoDB

- ExpressAPI

## View it live

Link to the deployed API: https://happythoughts-only.herokuapp.com/

Link to see the Frontend live: https://happyminds.netlify.app/
