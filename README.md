# Happy Thoughts App 

An API used for fetching and posting data with MongoDB. Similar to Twitter, the user get to like and post short messages. Built for happy thoughts. 

## View it live



## What I learned 🧠

* How to validate data 
* How to build a full API which includes handling of user input
* How to include error handling to return good validation errors
* How to build an API which works well with an existing frontend

## Requirements I reached 🧪

* The API implements the required routes
* The `GET /` endpoint only returns 20 results, ordered by `createdAt` in descending order
* The API  validate user input and return appropriate errors if the input is invalid
* In the `POST /` endpoint to create a new thought, if the input was invalid and the API is returning errors, it set the response status to `400` (bad request)
* The endpoint to add hearts to a thought returns an appropriate error if the thought was not found
* The API is deployed to Heroku 

## Stretch-goals I reached 🧘

* Added tags in order to organize them. 
* Allowed users to enter their name in a new property on the thought model, or remain anonymous.
* Added filtering and sorting options to the endpoint which returns all thoughts. So you could choose to sort by oldest first, or only show thoughts which have a lot of hearts.

