# Project Happy Thoughts API Backend ❤️💌

The aim of this week was to build a Happy Thoughts API using Express and MongoDB including both GET request enpoints that return data and POST endpoints to create data. This was done by creating a Thought Mongoose Schema and Model that represents the structure and holds properties for the message string, a heart property for tracking the number of likes, and a createdAt property to store when the thought was added.


## Documentation
<b>GET /thoughts</b>
This endpoint allows the user to retrive a maximum of 20 thoughts that has been sorted by createdAt and will show the most recent thoughts first.<br>

<b>POST /thoughts</b>
This enpoint allows the user to post thought message via a JSON body. To ensure consistent data, two validators has been included, a minlength 5 and maxlength 140.<br>

<b>POST thoughts/:thoughtId/like</b>
This endpoint allows the user to increase the likes of a specific thought. Given a valid thought id in the URL, the enpoint should find the thought and update its heart property. <br>

<b>DELETE/thoughts</b>
This enpoint allows the user to delete a thought based on the given id. 

## Tech
Node.js<br>
Express<br>
Mongoose<br>
MongoDB Atlas / Heroku<br>


## View it live

You can view my app live here: https://mt-dotse-happy-thoughts.netlify.app/

API is live in Heroku here: https://mtdose-happy-thoughts.herokuapp.com/thoughts
