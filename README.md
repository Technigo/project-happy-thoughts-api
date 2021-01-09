# Project Happy Thoughts API

Week 19: This weeks main goal was to learn about how to create **POST** endpoints which allow users to POST data to my API which then saves to my Mongo Database.
In week 11 we created a **Happy Thoughts** app which used a shared, pre-defined API. An app where you can POST thoughts and then like those thoughts by clicking on the heart icon. The idea is that once my Backend has been created this will replace the shared API.
I created an API in the Backend using Express and MongoDB which includes both GET and POST endpoints.

## The problem

The API is created using **Express** and consists of a **MongoDB** stored in Atlas. The API has been deployed to Heroku.
I implemented a new feature which wasn't available in the original API. I decided to add a "username" field to the POST request and implemented it in the Frontend.
All endpoints return an error message which contains information about the error.

## Endpoints

### /

Welcome page - shows a list of the main routes

### GET /thoughts

This returns the 20 most recent thoughts. Which are sorted by the createdAt property. You can also return data by sorting by most hearts property:
**/thoughts?sort=hearts** - sorts by most liked
**/thoughts?sort=oldest** - sorts by oldest
**/thoughts?sort=newest** - sorts by newest (default)

### POST /thoughts

This is the endpoint used to add a new Thought to the database.
It requires a JSON body. If no username is provided it will default to "Anonymous". Please see example below:

{ "message": "This is a test message", "username": "Test User" }

For the POST request to be valid the message must be between 5 - 140 characters.) If valid the thought will be saved and you will get a response showing the Thought object that was just created. Error messages will be sent if not explaining what went wrong.

### POST /thoughts/:thoughtId/like

This increments the "hearts" property by 1 when a valid thoughtId is provided in the URL. If the id is invalid an error message No body is required for this endpoint.  
When successful the API will respond with **"success": true,** and the thoughtId. See example below:
**"success": true,**
**"thoughtId": "5ff99c4cb2444150102df921"**

## Tech

- MongoDB
- Mongoose
- Node
- Express
- JavaScript
- Postman
- Heroku
- MongoDB Atlas & Compass

## View it live

My API can be found here:
And my completed app is here: https://think-happy-thoughts.netlify.app/
