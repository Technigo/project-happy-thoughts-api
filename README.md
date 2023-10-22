# Happy Thoughts API

## About

Welcome to the backend of Happy Thoughts! This is a custom-built API designed to serve as a backend for my Happy Thoughts React frontend application I did at Technigo bootcamp 2023. It aims to be a drop-in replacement for the Technigo API. The API is built using Node.js, Express, and Mongoose, and it features endpoints for creating, reading, and liking "happy thoughts".

Happy Thoughts UI (https://sweet-unicorn-99f547.netlify.app/)

## Setup and Installation

1. Clone this repository.
    ```bash
    git clone https://github.com/your-username/happy-thoughts-api.git
    ```
2. Navigate to the project directory.
    ```bash
    cd happy-thoughts-api
    ```
3. Install dependencies.
    ```bash
    npm install
    ```

4. Start the server.
    ```bash
    npm start
    ```

## Endpoints

### `GET /thoughts`

Returns a list of up to 20 thoughts, sorted by `createdAt` in descending order.

Example Response:

```json
[
  {
    "_id": "thoughtId1",
    "message": "Node.js is amazing!",
    "hearts": 5,
    "createdAt": "2023-10-21T18:35:00Z"
  },
  // ... more thoughts
]
```

### `POST /thoughts`

Creates a new thought.

Request Body Example:

```json
{
  "message": "Express is great!"
}
```

Response Example:

```json
{
  "_id": "thoughtId2",
  "message": "Express is great!",
  "hearts": 0,
  "createdAt": "2023-10-22T08:35:00Z"
}
```

### `POST /thoughts/:thoughtId/like`

Increments the heart count for a thought by 1. No request body required.

## Thought Model Schema

- `message`: String
  - Required
  - Min length: 5
  - Max length: 140

- `hearts`: Number
  - Defaults to `0`
  - Not assignable when creating a new thought

- `createdAt`: Date
  - Defaults to the current time
  - Not assignable when creating a new thought

## Deploying Your API

After building your API, deploy it to a server of your choice.


---

Happy coding! 🌟

## View it live

Deployed at Render: https://happy-thoughts-express-api.onrender.com/ 