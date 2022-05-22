# Project Happy Thoughts API

In this project I created a happy thoughts API which uses both GET endpoints to return data and POST endpoints to create data.

## The problem

The happy thoughts API has three endpoints.
The endpoint "/thoughts" is used for both returning data (GET method for retrieving happy thoughts as a sorted feed) and posting new data into the API (POST method for posting a new happy thought).
The endpoint "/thoughts/:thoughtId/like" is used for liking a specific happy thought and it utilizes the POST method to update the amount of likes and the mongoose findByIdAndUpdate() method to find the correct thought in which the like will be aimed for.

## View it live

Link to the deployed project:
https://happy-thoughts-api-tiiliu.herokuapp.com/

In the end I connected the API to a front-end application which I had created previously. Here's a link to that one too:
https://happy-thoughts-happy.netlify.app/
