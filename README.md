# Project Happy Thoughts API

The project was to build an API with Express and Mongodb which includes bot GET request endpoints to return data and POST endpoints to create data. 
Following the project "Happy Thoughts" that I built with React, like my own version of twitter focusing on positivity and friendliness, I created an API that worked in the same way as the excisting API that I used earlier. 

## The problem

The project was to replace the API and I began with creating a Thought Mongoose model and a Schema that included all the properties that we needed. By creating a POST request endpoint and testing that with Postman and MongoDB Compass, new messages could be written and added to the database with the save methodology. I continued with building an endpoint to create the like function and used the method FindByIdAndUpdate method. In the GET request I used methodes like sort, skip and limit to build the function that sortes the newest messages first and only shows 20 messages per page. I also created a DELETE - and PATCH requests and used the methods findOneAndDelete and findOneAndUpdate in order to delete a message and edit an exsisting message. In the end I connected my new API with the frontend and had to change the setThoughts(data) to setThoughts(data.response), 
If I had more time I would have continued with building the frontend with a delete button and an edit option. 


## View it live

Backend:
https://happy-thoughts-api-mdb.herokuapp.com/

Frontend: 
https://happy-thoughts-8.netlify.app/
