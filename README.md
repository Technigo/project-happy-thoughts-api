# Project Happy Thoughts API

API Description: "Happy Thoughts"

The "Happy Thoughts" API is a simple Express.js-based RESTful API designed to allow users to share and interact with positive thoughts and messages. Users can create, read, and interact with thoughts by posting, liking, and retrieving them via HTTP requests.

### Key Features:

Create Thoughts: Users can create new thoughts by sending POST requests to the /thoughts endpoint with a message.
List Thoughts: Users can retrieve a list of the most recent thoughts by sending GET requests to the /thoughts endpoint.
Like Thoughts: Users can express their appreciation for a thought by sending a POST request to the /thoughts/:thoughtId/like endpoint, where :thoughtId is the unique identifier of the thought.

### Endpoints:

- GET /: Provides a list of available endpoints and their HTTP methods.
- GET /thoughts: Retrieves a list of the most recent thoughts.
- POST /thoughts: Creates a new thought with a message provided in the request body.
- POST /thoughts/:thoughtId/like: Increases the heart count of the specified thought by one.

### Data Model:

The API uses a MongoDB database to store thoughts, with each thought represented as a document in the Thought collection. Each thought document contains the following fields:

message: The text content of the thought.
hearts: The number of likes (hearts) received by the thought.
createdAt: The date and time when the thought was created.

## View it live

https://project-happy-thoughts-api-b1g4.onrender.com
