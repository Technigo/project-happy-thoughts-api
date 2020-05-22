# Project Happy Thoughts API

RESTful API to use in earlier frontend project. It's possible to post messages, add likes and scroll the feed 💓👋💌🍻

## Code

I've used:
  * **Node.js**
  * **Express**
  * **MongoDB**
  * **Mongoose**

## The problem

Created a model that requires a message with a minimun of 5 letters and max 140. The message model also consist of the date when it's created and number of likes, default is 0. 
Made a GET request that finds and sorts the messages recieved and a POST request to actually create something to send and save. The endpoint to add likes uses the message unique id to add och save likes for each time it's clicked.
This project was pretty hands on and it easy to understand the backend even more. Also great to have a previous frontend project to use this in a fetch. Maybe I'll go back and make tags or a user name but for now I'm happy that it works and that I truly understand this project.

## View it live

My API: https://happy-thoughts-bealun.herokuapp.com

Deployed frontend: https://happy-thoughts-bealun.netlify.app
