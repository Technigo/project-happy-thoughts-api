# Happy Thoughts API

API created with Express & MongoDB.

## Description

An Express API that returns happy thoughts from a MongoDB, uses `POST` requests to post new thoughts & like existing thoughts.

Available endpoints:

Routes | Path
--- | ---
root | `/`
thoughts | `/thoughts`
like thought | `/:thoughtId/like`

Queries can be used to filter the `/thoughts` endpoint.

Query | Path | Value
--- | --- | ---
page | `?page=:page` | *number*
sort | `?sort=:sort` | `likes` / `newest`/ `oldest`


## Tech
- Mongo DB
- Mongoose
- Express
- Node.js
- Javascript


## Deployed
https://api-happy-thoughts.herokuapp.com/
