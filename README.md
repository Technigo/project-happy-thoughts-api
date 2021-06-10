# Project Happy Thoughts API

Using Express and MongoDB I built an API to include both GET and POST request endpoints to return and create data. Once built this would then be connected to the frontend project Happy Thoughts previously built. 

The Main Goals:
     -Combining our knowledge with previous to create a full API that handles user input.
     -Connecting that API successfully to a frontend project.
          -Happy Thoughts (Frontend) was a message app (like Twitter) allowing the user to post positive messages.
     -Understanding and implementing error handling within the code.

## The problem
Endpoints list: https://happy-thoughts-only.herokuapp.com/

Tools Used:
Express, Node.js, MongoDB, Heroku (for deployment)

Setting up GET requests for /thoughts to retrieve the ALL the Thoughts data from.

Setting up POST requests to help create Thoughts that are then added to the MongoDB. Connecting this to the FE allows for the user to create new thoughts that are then stored and displayed (with the help of the GET request before) below the text area.

POST for thoughts/:id/likes, using findByIdAndUpdate to allow users to increase the number of likes to a current Thought. This is then stored and remembered within the DB.

DELETE for thoughts/:id to allow for the deletion of a specific post found by it's Id number. Currently this is not implemented in the frontend but given more time I'd like to add a delete button to individual thoughts to implement this route.

Deploying the project to Heroku was the trickest part, I ran into issues where my paths were not properly connected between the frontend and backend, or fuctionality of the frontend wasn't working. I overcame interal server errors from heroku by making sure my url's matched up and my mongoDB was properly accepting requests from postman. Once the backend was working I began looking for the problems with the front ends functionality.

If I had the time I'd like to try setting up a username input and then attaching ownership of thoughts to them so that users can only delete their own thoughts that they've created.

## View it live

Heroku: https://happy-thoughts-only.herokuapp.com/
   GET: https://happy-thoughts-only.herokuapp.com/thoughts
  POST: https://happy-thoughts-only.herokuapp.com/thoughts
        https://happy-thoughts-only.herokuapp.com/thoughts/:id/likes
DELETE: https://happy-thoughts-only.herokuapp.com/thoughts/:id
        



HappyThoughts Frontend: https://elaines-happy-thoughts.netlify.app/
