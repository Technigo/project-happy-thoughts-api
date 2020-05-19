# Happy Thoughts API Project 19

Mission was to use Express and Mongodb to build an API which includes both GET request endpoints to return data and POST endpoints to create data.
Also to model the database using Mongoose models, and persist the data in the database.
Then modifying an earlier React frontend project to use this new API.

- Error handling using Try/Catch.
- Using environment variables.
- Using async/await.
- Resetting a database locally and externally via env variables.
- Deployed API to Heroku and database MongoDB Atlas cloud.
- Deployed Frontend to Netlify, GitHub for frontend: https://github.com/palhamel/project-happy-thoughts-frontend

#### Tech used: 
- Node.js, Express, MongoDB, MongoDB Atlas and JavaScript ES6
- VS Code, MongoDB Compass, Postman and Chrome.

## 

- GET endpoint:
https://project-w19-happy-toughts-api.herokuapp.com/ <br>
- POST endpoint:
https://project-w19-happy-toughts-api.herokuapp.com/ <br>




## The problem

I started off by implementing a mongoose model for my database. I then did a local seed to MongoDB and started working on the endpoints. I needed to do some changes in the model and did a new database seed. Kept on working on the endpoints and handling errors. 
When everything worked locally I first deployed to Heroku. Also set up MongoDB Atlas. Tested first with a empty database and then did a seed to MongoDB Atlas using Heroku Config Vars and "RESET_DATABASE=true" to run my seed to db. 

## View it live 

https://happy-goldstine-756f62.netlify.app/



