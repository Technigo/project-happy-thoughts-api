# Project Happy Thoughts API

The main goal of this project is to learn <bold> POST request: </bold> expose endpoints to my users to allow them to POST data to my API and then use that data to save new objects in my Mongo database.

## Endpoints
GET /

Retrieves the root endpoint and displays a welcome message along with the available endpoints.

GET /thoughts

Retrieves the most recent thoughts, sorted by createdAt field in descending order (limited to 20 thoughts).

POST /thoughts

Creates a new thought with the provided message and username (optional). If no username is provided, it defaults to 'HappyAnonymous'.

POST /thoughts/:id/like

Increases the number of hearts for a specific thought by 1.

## The problem

I'm working with mongoose order to create the endpoints and manipulate the data. I started the project by creating a model for a simple 'Thought'.

The 'Thought' model has validation rules for clean data storage, such as required fields and min/max length properties.

All endpoints use a try / catch combination for error handling. If an input is invalid, a dedicated error message will show up. 


## View it live

Every project should be deployed somewhere. Be sure to include the link to the deployed project so that the viewer can click around and see what it's all about.
