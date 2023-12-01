
# Project Happy Thoughts API

As part of a Technigo Web Dev Bootcamp project, this API was created using Express JS, MongoDB and Mongoose. The API has three endpoints. One POST-method for sending in a thought either in a testing environment using Postman or utilizing a frontend application and input fields to add to the API. By sending a GET-request, all "thoughts" saved in the database will be displayed, in a descending order with the 20 first "thoughts". The user can also like "thoughts" by sending a POST-request to the API endpoint "/like". An additional endpoint for a uniqe "thought" has also been added. 

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGO_URL` - Get your Conncection String from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
## API Reference

#### Show endpoints

```http
  GET /
```

| Description                |
| :------------------------- |
| Shows all available endpoints|

#### Get all thoughts

```http
  GET /thoughts
```

| Description                |
|:------------------------- |
| Gets all thoughts that are currently in the database |

##### Thoughts schema

```http
  message: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 140,
    },
    hearts: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: () => new Date(),
    },
```
#### Post a new thought

```http
  POST /thoughts
```
| Description                |
|:------------------------- |
| Posts a new thought to the database |

#### Get one thought

```http
  GET /thoughts/:_id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `_id`      | `string` | **Required**. Id of movie to fetch. Replace ":_id" with your id. |

#### Post a like on a thought

```http
  POST /thoughts/:_id/like
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `_id`      | `string` | **Required**. Id of movie to fetch. Replace ":_id" with your id. |
| `like`      | `string` | **Required**. To send a POST-request that adds a like |

## View it live
Backend only: [![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)](https://happy-thoughts-api-ru1g.onrender.com)

With frontend: [![Netlify Status](https://api.netlify.com/api/v1/badges/a058da08-22d3-4898-8913-fba7338c9a1c/deploy-status)](https://happy-thoughts-lauralyckholm.netlify.app)

## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-1DA1F2?style=for-the-badge&logo=ko-fi&logoColor=white)](https://portfolio-laura-lyckholm.netlify.app/)

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lauralyckholm/)

[![gitgub](https://img.shields.io/badge/github-000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/LauraLyckholm)