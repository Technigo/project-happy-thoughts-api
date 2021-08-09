# Bootcamp-Project #16: Project Happy Thoughts API
This weeks project was about building a full API including handling of user input, error handling and connect it with an existing frontend. This API is now conntected to a previous frontend-project (#09: Happy Thoughts).

## Learning content and lessons learned:
- Peer code review
- How to use POST requests to send data to your API
- How to store data in your database from POST requests
- How to validate data and ensure your database only contains 'good' data
- How to build a full API which includes handling of user input
- How to include error handling to return good validation errors
- How to build an API which works well with an existing frontend

The biggest struggle on this project was the deployment on heroku. I was able to manipulate the data with mongoose, the code was tested with postman and was working locally, but finding out that the key on heroku was wrong took me some time. Other than that this week was pretty exciting. Being able to connect this project with a previous frontend project was fun and seeing the connection between the two projects helped my understanding a lot. 

## Endpoints are:
- GET /thoughts --> get thoughts
- POST /thoughts --> post a thought 
- POST /thoughts/:thoughtId/like --> post a like to a specific thought
- PATCH /thoughts/:thoughtId --> update thought
- DELETE /thoughts/:thoughtId --> delete thought

## View it live
backend: https://happy-thoughts-noemi.herokuapp.com/
frontend: https://project11-happythoughts.netlify.app/

