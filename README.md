## The project

This is a backend project which models a database using Mongoose models, persisting data in a database, and uses that data to produce a RESTful API.
The API has endpoints to GET, POST, DELETE and update (PATCH) object in the database.

## The problem

I started the project by installing dependencies and needed to force some updates in order for the project to get up and running in the localhost.
Since I had already created a frontend that fetched data from a similar API to the one I was about to create, I began by creating a Mongoose Schema and Model with properties named the same as the ones that are fetched in the frontend.
I installed express list endpoints to create a first route that will display all endpoints, then started building endpoints to get the 20 most recent thoughts in the database and to post new thoughts that were saved to the database.
By using the Mongoose model, each thought is assigned an id that I used as param to get a specifik thought. In this way I could create endpoints that delete or update a specific thought.
If there is a problem getting data in any endpoint, an appropriate error message appears.
I deployed the project on heroku and connected the database by adding a config var. If I had more time I would add more properties to the mongoose model, such as name and enums/categories and also input field/dropdown list in the frontend to make each thought richer.

## View it live

API: https://johannamj-happy-thoughts.herokuapp.com/
Frontend, using the API: https://share-some-happiness.netlify.app/
