# Project Happy Thoughts API
Happt Thoughts API - use the same paths and params as Technigo's.

Main endpoint is https://happy-thoughts-api-vd.herokuapp.com/

GET / : Returns array of maximum 20 thoughts, in descending order
POST / : Post a thought. Body must contain a message between 5-140 characters
POST /:id/like : Adds a like to a post - id in ObjectID format

Front-end app is redirected to this API instead of Technigo's:

https://jolly-mirzakhani-6930bc.netlify.com/

## Testing

Tests are created at the data/model layer, the service layer as well as integration tests at the endpoints. I have not implemented any end-to-end tests as the unit/endpoint tests should be exhaustive. 

Tests are implemented with jest and supertest, mainly followed this excellent guide by Fredrik Christenson: https://www.youtube.com/watch?v=ACzMbQEq_tw. Due to the method chaining in mongoose I eventually managed to use sinon.spy() by implementing a stub for the find().sort().limit() query in the service.
