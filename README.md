# API with Express and MongoDB

### Summary

A custom Message API created with Express, MongoDB and Mongoose to provide short Twitter like messages from users.

### Implementation details

The following endpoints have been implemented in Express:

- Get all messages - **GET /api**
- Post a new message - **POST /api** with request body: `{ "message": "text" }`
- Like a message - **POST /api/:messageId/like**

Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node JS. It this project Mongoose manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB.

To combat invalid data in incoming API requests I decided to use Joi, a powerful schema description language and data validator for JavaScript. Together with the Express middleware library Celebrate, which is a wrapper for the Joi library, I can intercept and validate incoming requests before they even reach the route handler. That reduces unneccesary logic and makes the code cleaner in the route handlers.

### Technologies used

- JavaScript ES6+
- Node JS
- [Express](https://expressjs.com/) - A minimal and flexible Node JS web application framework
- [MongoDB](https://www.mongodb.com/) - A general purpose, document-based, distributed database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling for Node JS
- [Joi](https://github.com/hapijs/joi) - A powerful schema description language and data validator
- [Celebrate](https://github.com/arb/celebrate) - A Joi validation middleware for Express JS

### Where can you see it in action?

- URL to custom Message API: https://express-happy-thoughts-api.herokuapp.com/api
- URL to Message site using the API: https://goofy-shannon-552309.netlify.com/
