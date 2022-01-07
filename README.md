# Project Happy Thoughts API

This week's project was to build our API for our front-end project Happy Thoughts

## The problem

The API is built with MongoDB and Mongoose. My Mongoose model has 4 properties (user,message, hearts, and createdAt), which have some validation rules like the min or max length of a string. There are 4 endpoints. I used the Express List Endpoints package to list all of them. There is the GET /thoughts to receive all the thoughts and I have implemented pagination in order the user to be able to choose how many results will diplayed per page and to navigate through the pages.
POST /thoughts is the endpoint that allow the user to post his/her thoughts. User has the possibility to post anonymously.
POST /thoughts/:thoughtId/like is the endpoint that you can use to like a post.

## View it live

https://efthymios-happy-thoughts.herokuapp.com/
