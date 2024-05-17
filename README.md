# Project Happy Thoughts API

This project aims to create an API backend for the Happy Thoughts app, providing endpoints for storing and retrieving positive messages or "thoughts".

## The problem

The assignment required building a backend API to replace the existing Technigo API used in the frontend Happy Thoughts project. The API should allow users to post new thoughts, retrieve recent thoughts, and like existing thoughts.

## Approach and Tools

To solve the problem, the following approach and tools were used:

- **Planning**: Defined the API endpoints and data model based on the project requirements.
- **Technologies**: Used Node.js, Express.js, Mongoose, and MongoDB for building the API backend.
- **Error Handling**: Implemented error handling middleware to catch JSON parsing errors and respond with appropriate error messages.
- **Input Validation**: Validated user input to ensure that posted messages meet specified criteria (e.g., minimum and maximum length).
- **Model Schema**: Defined a Mongoose schema for the `Thought` model with properties for message, hearts, and createdAt.
- **API Endpoints**: Implemented GET, POST, and PATCH endpoints to handle retrieving, posting, and liking thoughts.
- **Deployment**: Deployed the API backend to a server to make it accessible for the frontend.

If more time were available, some next steps could include:

- Implementing additional features such as categorizing thoughts with tags.
- Allowing users to provide their name or remain anonymous.
- Adding filtering, sorting, and pagination options for retrieving thoughts.

## View it live

Frontend: https://mindful-and-happy.netlify.app/
Backend: https://happy-thoughts-api-igwpvuz3lq-lz.a.run.app/
