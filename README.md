# Project Happy Thoughts API

This project involves creating an API for a "Happy Thoughts" platform, a positivity-focused version of Twitter. The assignment is to build a backend API that serves as a replacement for the Technigo-provided API, allowing a React frontend to interact with it seamlessly. The API will handle features like posting new thoughts, listing recent thoughts, and updating the number of likes (hearts) for each thought.

## The problem

To complete this project, I needed to design and implement a fully functional RESTful API using Node.js, Express, and MongoDB. The primary challenge was to ensure the API followed the specific requirements, such as input validation, endpoint functionality, and seamless integration with the existing frontend.

### Approach and Tools:

- **Planning:** I broke down the project into key functionalities, starting with creating the Thought model, then implementing and testing each endpoint.
- **Technologies:**
- Backend Framework: Express.js to manage API routes and middleware.
- Database: MongoDB with Mongoose for data modeling and validation.
- Deployment: Deployed the API on Render to make it accessible for frontend integration.
- Validation: Used Mongoose schema validation and manual checks to ensure user input met all requirements.

### Key Steps:

- **Thought Model:**
Defined a Mongoose schema with properties:
- message (required, 5-140 characters).
- hearts (default to 0, unassignable during creation).
- createdAt (default to current timestamp, unassignable during creation).
Endpoints:
- GET /thoughts: Returned up to 20 recent thoughts, sorted by creation date.
- POST /thoughts: Allowed new thoughts to be submitted, with proper validation and error handling.
- POST /thoughts/:thoughtId/like: Incremented the hearts property for a specific thought.
Validation and Error Handling:
- Ensured invalid input resulted in clear error messages and a 400 Bad Request status.
- Checked for non-existent thought IDs in the POST /thoughts/:thoughtId/like endpoint.
Frontend Integration:
- Updated the React app to use the new API by replacing the Technigo URL with the deployed API URL.

## View it live

Frontend Netlify: https://happy-thoughts-project-technigo.netlify.app/
Frontend GitHub: https://github.com/EmelieNyberg/project-happy-thoughts-vite-ek
Backend Render: https://project-happy-thoughts-api-ek.onrender.com/
