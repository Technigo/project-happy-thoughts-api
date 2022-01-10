# Project Happy Thoughts API

This week the assignment was to use Express and Mongo DB to build an API that include both GET request endpoints and POST endpoints to create data.

## Problem

The fundamental idea is for this to be an API, used for a previous frontend project called Happy Thoughts - a twitter like site focusing on positivity and friendliness where the user can post own thoughts, and read and like thoughts from others.

### Learning objectives:

* How to build a full API which includes handling of user input
* How to include error handling to return good validation errors
* How to build an API which works well with an existing frontend

## API Documentation

* `GET /` - main endpoint which list all the endpoints
* `GET /endpoints` - list of all the endpoints
* `GET /thoughts` - endpoint which returns a maximum of 20 thoughts, sorted by `createdAt` to show the most recent thoughts first.

* `POST /thoughts` - endpoint to post new thoughts
* `POST thoughts/:thoughtId/like` - endpoint to add a heart/like

## View it live

* [Link to API](https://project-happy-thoughts--api.herokuapp.com)
* [Link to API endpoint of thoughts](https://project-happy-thoughts--api.herokuapp.com/endpoints)
* [Link to fullstack project](https://my-happy-thought.netlify.app/)
