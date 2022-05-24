# Project Happy Thoughts API

This week we were to build a backend api using Express and MongoDB. The backend should include both GET and POST request endpoints. It should be connected with a previous project (project-happy-thoughts) through an API-fetch. It should also show appropiate errors for the status codes 400 and 404.

## The problem

I began with writing a mongoose model and schema for "Thought". Then I created the POST request to be able to post and save new thoughts. I also created a POST request for the likes of the post. Then I created a GET request so the user could get all the saved thoughts. I also added a delete and patch request so I can expand this application in the future and make it more complex.

In the frontend I changed the API fetch to my heroku-deployed API. 

I ran into some issues with the deployed link not showing the posted thoughts. This was solved by adding config wars to the deployed project on heroku.

## View it live

Backend: https://api-happy-tweets.herokuapp.com/thoughts
Frontend: https://spring2022-happy-tweets.netlify.app/
