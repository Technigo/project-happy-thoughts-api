# Project Happy Thoughts API

Build an API which includes both GET request endpoints to return data and POST endpoints to create data.

## Goals: 

- `GET` endpoint should only return 20 results, ordered by `createdAt` in descending order.
- API should validate user input and return appropriate errors if the input is invalid.
- In the `POST` endpoint to create a new thought, if the input was invalid and the API is returning errors, it should set the response status to `400` (bad request).
- The endpoint to add hearts to a thought should return an appropriate error if the thought was not found.

## Endpoints
- GET '/thoughts': returns a maximum of 20 thoughts, sorted by createdAt to show the most recent thoughts first.;
- POST '/thoughts': This endpoint expects a JSON body with the thought message. If the input is valid, the thought is saved, and the response includes the saved thought object, including its _id;
- PATCH '/thoughts/:id/hearts': This endpoint doesn't require a JSON body. Given a valid thought id in the URL, the API updates the thought's `hearts` property to add one heart.

## View it live

Frontend: https://happy-thoughts-klimenko.netlify.app/

Backend: https://klimenko-happy-thoughts-api.herokuapp.com/

