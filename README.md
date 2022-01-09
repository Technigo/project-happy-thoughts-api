# Project Happy Thoughts API

This was a @Technigo week 19 project which consisted of building an API with messages using Node.js, Express, MongoDB and Mongoose and connecting it the previous frontend project Happy Thoughts from week 11.

## The problem

The backend needed to provide endpoints for to get the messages, post a new message according to the required format, give a message a like and return a limited number of messages. The endpoints needed to be provided with appropriate responses to the frontend to signal wether the request was successful or generated an error, and if so, what kind.

To start, a mongoose model was created for the messages, called Thought, and the schema was declared separately. Then the endpoints mentioned was built. Ascync/await was used for promises throughout.

As extra features this week I added options for sorting the list of messages and pagination in the backend and the frontend. Possibility to patch and delete was added to the backend but is still to be implemented in the frontend.

## View it live

https://kind-haibt-7a22e5.netlify.app/
