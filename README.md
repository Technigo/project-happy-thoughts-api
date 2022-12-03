# Project Happy Thoughts API

Create an API to be used for the previously made frontent Happy Thoughts Project. The user POST data to the API which is saved in the database.

## The problem

- The GET/thoughts endpoint resturns 20 results, ordered by CreatedAt in decending order.
- The API validate user-input and return appropiate errors if the input is invalid.
- The POST/ thoughts endpoint is used to create a new thought, if the input is invalid and the API is returning errors, it should set the response status to 400 (bad request)
- The endpoint to add hearts to a thought shows an appropriate error ig the thought was not found.

Next steps on this project would be:
- Give thoughts a category or atgs. So you could organize them.
- Allow users to enter their name in a new property on the thought model, or remain anonymous.
- Add filtering and sorting options to the endpoint which returns all thoughts. To be able to sort by oldest first, or my most hearts first.
- Implement pagination in backend and fronted to make it possible to click through pages of thoughts.
- Experiment with infinite scrolling (involving backend and frontend changes).

## View it live

Backend:
https://project-happy-thoughts-api-ircjrh2jfq-lz.a.run.app/

Frontend:
https://dontworry-behappy.netlify.app/