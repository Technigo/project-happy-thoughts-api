# API with Express and MongoDB

### Summary

A custom message API created with Express, MongoDB and Mongoose to provide short Twitter like messages from users.

### Implementation details

The following endpoints have been implemented in Express:

- Get all messages - **GET api/**
- Post a new message - **POST api/** with request body: `{ "message": "text" }`
- Like a message - **POST api/:messageId/like**

### Technologies used

- JavaScript ES6+
- Node JS
- [Express](https://expressjs.com/) - A minimal and flexible Node JS web application framework
- [MongoDB](https://www.mongodb.com/) - A general purpose, document-based, distributed database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling for Node JS
- [Joi](https://github.com/hapijs/joi) - A powerful schema description language and data validator
- [Celebrate](https://github.com/arb/celebrate) - A Joi validation middleware for Express JS

### Where can you see it in action?

URL to custom message API: https://express-happy-thoughts-api.herokuapp.com/api
