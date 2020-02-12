# Message API with Express and MongoDB

### Summary

A custom message API created with Express, MongoDB and Mongoose to provide short Twitter like messages from users.

### Implementation details

The following endpoints have been implemented in Express:

- Get all messages (GET "/")
- Post a new message (POST "/" with body: `{ "message": "text" }`)
- Like a message (POST "/:messageId/like")

### Technologies used

- JavaScript ES6+
- Node.js
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Joi](https://github.com/hapijs/joi)
- [Celebrate](https://github.com/arb/celebrate)

### Where can you see it in action?

URL to custom message API: https://express-happy-thoughts-api.herokuapp.com/api
