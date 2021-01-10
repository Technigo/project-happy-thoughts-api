# Project Happy Thoughts API

In this project I've created my own API for the frontend project "Happy Thoughts. It includes both GET request endpoints to return data and POST endpoints to create data.

## The problem
I started by creating a mongoose model for Thougt. It consists of message, heart (a heart-button in the frontend) and createdAt. I set some rules and validations to the all. Then I created a GET endpoint that retrieves a list of 20 thoughts in descending order. I also created two POST requests, one that posts a message between 5 and 140 characters and one the updates likes (when the user presses the heart button).
 
## Learning objectives
* How to build a full API which includes handling of user input
* How to include error handling to return good validation errors
* How to build an API which works well with an existing frontend


## View it live

Link to deployed API: https://sara-happy-thoughts.herokuapp.com/thoughts

Link to frontend repository: https://github.com/stjernberg/project-happy-thoughts
Link to frontend site: https://happy-messages.netlify.app/
