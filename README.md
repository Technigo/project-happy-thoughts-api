# Project Happy Thoughts API

The aim of the project was to build an API that includes handling of user input and works well with an existing frontend, and to:

✓ use POST requests to send data to the API

✓ store data in a database from those POST requests

✓ validate data and ensure the database only contains 'good' data

## The problem

MongoDB was used as the database and Mongoose to model and store the data. For the API the following endpoints were made to fit the existing frontend project "Happy Thoughts":

**/thoughts** - get 20 of the latest thoughts currently stored in the database using GET **OR** POST and new thought to be added to the database provided it passes validation 

**/thoughts/:id/like** - increase an existing thoughts like count (for when user clicks the heart button on the frontend)


## View it live

View the API:
https://project-happy-thoughts-api-d6aenh5q2a-lz.a.run.app/

View it when used in a frontend:
https://happy-thoughts.brucette.com/

