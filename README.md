# Project Happy Thoughts API

Technigo project week 15. Building an API using Express, MongoDB with GET request endpoints to return data and POST endpoints to create data. The project is also connected to a prior project. See links below.

## The problem

It's still a learning journey as we just started with backend. This week made me understand the backend better, especially how to connect it to the frontend. Biggest challenge was to deploy. ChatGPT, google and discussing with team-mates in order to make it work. Once adding the deployed link to the frontend it became really slow which made me thought something was wrong. Turns out I just needed to re-start my computer.

## API explained

GET /
Description: This endpoint serves as the default route to get API documentation, listing all available endpoints.

GET /thoughts
Description: This endpoint retrieves the 20 latest thoughts from the MongoDB database and returns them as a JSON response.

POST /thoughts
Description: This endpoint creates a new thought. It performs input validation to ensure that the message length is within the range of 5 to 140 characters. If successful, it returns the saved thought as a JSON response.

POST /thoughts/:thoughtID/like
Description: This endpoint allows users to "like" a thought. It increments the hearts count for the specified thought identified by thoughtId. If the thought is not found, it returns a 404 status with a corresponding JSON response. If successful, it returns the updated thought with the incremented hearts count.

## View it live
Backend:
[https://collins-happy-thoughts-api.onrender.com/] (https://collins-happy-thoughts-api.onrender.com/)

The prior frontend project with Happy Thoughts is updated with this API:
[https://project-happy-thoughts-collin.netlify.app/] (https://project-happy-thoughts-collin.netlify.app/)

## Connect with Me

[![GitHub](https://img.shields.io/badge/GitHub-black?style=flat-square&logo=github)](https://github.com/IdahCollin)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/idah-collin)

[My portfolio](https://idah-collin-portfolio.netlify.app/)
