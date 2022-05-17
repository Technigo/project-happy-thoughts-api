# Project Happy Thoughts API

In this week's project, we used Express and MongoDB to build an API that included both GET request endpoints to return data and POST endpoints to create data.

In a previous week we built project Happy Thoughts, a frontend in React which uses an API we created to store thoughts.
It an version of Twitter, but focused on positivity and friendliness.

## The problem

The API needed to work like the API we used in the frontend happy thoughts project.
I created a Schema in mongoose for the messages, likes/hearts and the time it was written and put it in a model.
It needed a get request endpoint to return a maximum of 20 thoughts, sorted by createdAt to show the most recent thoughts first.
A post request endpoint with a json body including the thought message, validating it and save the thought message and its id.
It also needed a post request endpoint to be able to like the posts.

## View it live

Every project should be deployed somewhere. Be sure to include the link to the deployed project so that the viewer can click around and see what it's all about.
