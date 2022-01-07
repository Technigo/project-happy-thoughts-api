# Project Happy Thoughts API

API created to POST and GET thoughts for the Happy Thoughts application - https://myhappy-thoughts.netlify.app/

## Feautures

- GET request to get all thoughts
- POST request to add new thoughts
- POST request to increase amount of likes

## Production Process

I started by creating a model and a schema, to specify different validation for the properties.
I created then the POST request to add new thoughts and increase the amount of likes.
The GET request to display the thought is sorted by decreasing dates and has a limit of 20 thoughts.
The POST requests have error handling.

## View it live

https://myhappy-thoughts-api.herokuapp.com/
