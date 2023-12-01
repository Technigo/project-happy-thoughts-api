# Project Happy Thoughts API

This project aimed to apply recently acquired skills in Express.js and MongoDB to construct an API featuring GET request endpoints for data retrieval and POST endpoints for data creation.

## The problem

In this project, I utilized Express and Mongoose to construct an API, defining routes for both GET and POST methods. The API includes endpoints for displaying all messages and allowing users to add messages to the database. MongoDB Atlas is used for database storage, and Render is employed for API deployment. The project focuses on building a Mongoose model for thoughts (posts) with properties such as the message string, a heart property to track likes, and a createdAt property. Three endpoints are created to retrieve all thoughts, post a new thought, and update the number of likes for a post. The overarching goal is to develop a robust and scalable API with specific validations for message, hearts, and createdAt properties in the Thought model.

## Happy Thoughts API Endpoints

### Get API Information

Endpoint: /  
Method: GET  
Description: Retrieves information about Susannes Happy thoughts API, including a list of available endpoints.  
Response:  
{  
"success": true,  
"message": "OK",  
"body": {  
"content": "Susannes Happy thoughts API",  
"endpoints": ["/", "/thoughts", "/thoughts/:thoughtId/like"]  
}  
}

### Get Recent Thoughts

Endpoint: /thoughts  
Method: GET  
Description: Retrieves the 20 most recent thoughts in descending order.  
Response:  
{  
"\_id": "123abc",  
"message": "This is a happy thought!",  
"hearts": 5,  
"createdAt": "2023-01-01T12:34:56.789Z"  
},  
// ... (more thoughts)

### Post a New Thought

Endpoint: /thoughts  
Method: POST  
Description: Adds a new thought to the database. The hearts and createdAt properties are automatically set.  
Request Body:  
{  
"message": "This is a new happy thought!"  
}  
Response:  
{  
"\_id": "456def",  
"message": "This is a new happy thought!",  
"hearts": 0,  
"createdAt": "2023-01-02T14:45:23.456Z"  
}

### Like a Thought

Endpoint: /thoughts/:thoughtId/like  
Method: PUT  
Description: Increments the number of hearts for a specific thought.  
Parameters: thoughtId: The ID of the thought to like.  
Response:  
Success:  
{  
"\_id": "123abc",  
"message": "This is a happy thought!",  
"hearts": 6,  
"createdAt": "2023-01-01T12:34:56.789Z"  
}

Not found:  
{  
"message": "Not found"  
}

## View it live

Backend deploy, Render: https://happy-thoughts-api-k50a.onrender.com/  
Frontend deploy, Netlify: https://project-happy-thoughts-susanne.netlify.app/

## 🔗 Links

[![portfolio](https://img.shields.io/badge/my_portfolio-1DA1F2?style=for-the-badge&logo=ko-fi&logoColor=white)](https://my-portfolio-susanne-ekenheim.netlify.app//) [![gitgub](https://img.shields.io/badge/github-000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/smExlex) [![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/susanne-e-6915a087//)
