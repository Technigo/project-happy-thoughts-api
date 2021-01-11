# Project Happy Thoughts API - Overview
Building and API to handle GET and POST requests to connect with the frontend project from a previous assignment. 

Learning objectives:
- How to build a full API which includes handling of user input
- How to include error handling to return good validation errors
- How to build an API which works well with an existing frontend


<!-- ## Approach -->


<!-- ## Core Tech -->


## Completed Requirements
🔵  Blue Level
- The API should be deployed to Heroku or similar hosting service.
- The database should be deployed using mongo cloud or similar.
- The API should implement the routes exactly as documented in the brief (A .PDF of the brief can be found in the production folder).
- The `GET /thoughts` endpoint should only return 20 results, ordered by `createdAt` in descending order.
- The API should validate user input and return appropriate errors if the input is invalid.
- In the `POST /thoughts` endpoint to create a new thought, if the input was invalid and the API is returning errors, it should set the response status to `400` (bad request).
- The endpoint to add hearts to a thought should return an appropriate error if the thought was not found.

<!-- 🔴  Red Level (Intermediary Goals) -->
<!-- ***Remember**:* For any new feature you add to the backend, be mindful of how that will require the frontend to change, and vice-versa.   -->
<!-- - Give thoughts a category or tags. So you could organize them. For example 'Food thoughts', 'Project thoughts', 'Home thoughts', etc. -->
<!-- - Allow users to enter their name in a new property on the thought model, or remain anonymous. -->

<!-- ⚫  Black Level (Advanced Goals) -->
<!-- - Add filtering and sorting options to the endpoint which returns all thoughts. So you could choose to sort by oldest first, or only show thoughts which have a lot of hearts. -->
<!-- - Implement [pagination](https://stackoverflow.com/questions/5539955/how-to-paginate-with-mongoose-in-node-js) in your backend & frontend so you can click through pages of thoughts.  The frontend could request a specific page, and show only that page.  The backend would take the request for that page and return only the thoughts for that page. Rather than only showing the most recent 20 thoughts. -->
<!-- - You could also experiment with implementing [infinite scrolling](https://www.npmjs.com/package/react-infinite-scroller) on the frontend rather than having a list of page numbers. This idea is similar to paging and involves frontend & backend changes. -->
<!-- - Feel free to add other features that pop into your mind to exercise creating and fulfilling a virtual "contract" between the frontend and backend. This is a very valuable exercise in understanding both parts. -->


## View it live
https://happy-thoughts-api-pwangy.herokuapp.com/
