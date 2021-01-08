# Project Happy Thoughts Backend 💜

This week we were to create the backend for our previous project Happy Thoughts. Instead of using the provided backend, we were to point our frontend to use this database. It's a database built with Node.js, Express and MongoDB, served by MongoDB Atlas.


## The problem

To begin with I had to go through the frondend to see what endpoints I will need to create, and what type of requests to use. Starting off I wrote the main GET-request to /thoughts, to be able to list the latest 20 thoughts. Then I continued on creating the POST request to /thoughts, and the model that'll be used for each record. Lastly I created the POST request on /thoughts/:id/like, to be able to like each thought. 

For this I used the updateOne and the $inc-method. By posting a request to a path to a single thought, it's hearts-value will increase by 1.

Then I added some extra error handling, part from the try/catch-methods that I added earlier. For example, the message-part of the model has to be more than 5 letters, but no more than 140. And for each error that occurs, a custom message will appear.

Finally I also added an author to the model, with a default value of 'Anonymous', giving the user the opportunity to add a name to it's thought. I modified the frontend by adding a second input-field, a p-tag with the name in each thought and a modified request with author added to the request body.


## Tech

* Node.js
* Express
* MongoDB
* MongoDB Atlas / Heroku


## View it live

The frondend is live here: https://happy-thoughts-by-karin.netlify.app
Backend url: https://happy-thoughts-by-karin.herokuapp.com/