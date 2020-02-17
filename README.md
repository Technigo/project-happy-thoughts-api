# Project Happy Thoughts API

This week's project at the Technigo boot camp was to continue practicing MongoDB and 
Express to build an API which includes both GET request endpoints and POST endpoints.
Another part of the project was to fetch data from this API in a previous frontend
project, 'Happy Thoughts'.

Tech:
<br>MongoDB, Express</br>

I created a 'Thought' mongoose model which has properties for the message string, 
a heart property for tracking the number of likes and a createdAt property to store
when the thought was added. I created three endpoints: 1) GET / to return the
20 most recent thoughts, 2) POST / for saving new thoughts, and 3) POST /:thoughtId/like
for finding a thought and updating its hearts property to add one heart.

Deployed project: <br>Backend-part: https://michel-happy-thoughts.herokuapp.com/ </br>
Frontend-part: https://michel-happy-thoughts.netlify.com/ 
