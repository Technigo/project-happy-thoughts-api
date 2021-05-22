# Project Happy Thoughts API

This week my assignment was to create the backend API of Happy Thoughts, a Twitter like app for which I've built a front-end a couple of months ago. I was supposed to set up a database with MongoDB and connect it to my deployed Heroku backend. For this project it was needed to create an API with a possibility to post and get thoughts, but also with the possibility to like thoughts. 

## The problem

This week I started with creating an endpoint to post thoughts. As soon as I got that one up and running, and could see that my thoughts was being posted properly, I continued with creating a get endpoint to be able to get the existing posts. I sorted them by the time they were created, with the most recent on top. I also limited them to show only the last 20 messages. 
As soon as I had this working, I set up the endpoint to post likes. Once this was done, I connected the deployed backend to my frontend, which was easy to do by just replacing the URLs already in that repo. 
To complete the project, I also created one patch endpoint to make it possible yo update a thought, and a delete endpoint to make it possible to delete a thought. 

I decided not to go for the red and black requirements this week, since I wanted to focus a bit on planning for the final sprint, and also to wrap up previous projects a bit.


## View it live

The backend is deployed here:

https://backend-happy-thoughts.herokuapp.com/

and it's connected to my front-end which is deployed here:

https://therese-happy-thoughts.netlify.app/