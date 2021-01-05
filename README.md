# Project Happy Thoughts API 💌
For this project we were tasked to create an API with three different endpoints to be used in the Happy Thoughts project we did in week 11. These included:
1. A GET endpoint that gets the last 20 thoughts created and that are stored on the MongoDB database.
2. A POST endpoint that is used when the user wants to post a message to the database. The only data required to be posted via the body is the message property with the message.
3. A POST endpoint that can be used when the user hearts a thought. The endpoint targets the thought id in the url and then updates the hearts property for that specific thought in the database.

The blue requirements were:
- Your API should implement the routes exactly as documented in the brief.
- Your GET /thoughts endpoint should only return 20 results, ordered by createdAt in descending order.
- Your API should validate user input and return appropriate errors if the input is invalid.
- In the POST /thoughts endpoint to create a new thought, if the input was invalid and the API is returning errors, it should set the response status to 400 (bad request).
- The endpoint to add hearts to a thought should return an appropriate error if the thought was not found.

## The problem
1. I tackled the problem by reffering to the previous weeks project to get the database up and running and to start to create the model which is the blueprint for the object that is created everytime the user posts a new message.
2. Because each property of the model required some extra parameters and requirements. I got those done before I went on to create the endpoints. These extra parameters were to both help with validation when the user is posting a new thought and to set the default for both the hearts and createdAt to a specific value so they couldn't be overwritten by the user when they were creating a new thought.
3. Then I focused on getting the endpoints written and implementing what was required for each endpoint according to the project. This included:
    - Using the sort and limit methods to make sure that the last 20 thoughts were returned on the get endpoint.
    - That only the message property can be updated when the post request is sent to the backend. 
    - And that the thought id is targeted and that the hearts property is updated for that thought. This was done in the endpoint by using the mongoose method of updateOne() and $inc to include that the hearts property is incremented by 1.
4. I used the try and catch form to allow for the handling of the requests if they succeed or not. And implemented in the catch an error to be shown if for example the user tries to send a message that is less than 5 and more than 140 letters long or heart a thought with an invalid id.
5. Once everything was set up I tested it in postman using the local host, made sure that the data was coming through on my database and then depolyed to heroku. 
6. Then I changed the endpoints in the Happy thoughts project and made sure that they were working and that I was getting the data that was stored on and being posted to my database.

## View it live 💌
Happy thoughts API: https://claireshappythoughts.herokuapp.com/

Happy thoughts project: https://silly-wing-fdef06.netlify.app/
