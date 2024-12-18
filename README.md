# Project Happy Thoughts API

This project centers around creating a fully functional Happy Thoughts Messaging API using Node.js, Express, and MongoDB. The API integrates seamlessly with the Happy Thoughts React application, enabling users to fetch existing thoughts and post new ones through clearly defined endpoints.

## `Highlights`
- `RESTful Endpoints`: 
Developed GET endpoints to retrieve a collection of recently created happy thoughts—limited to 20 results—and POST endpoints to add new thoughts or increment the "heart" count of existing ones.
- `Data Validation & Error Handling`: 
Implemented robust input validation to ensure that all submissions meet the defined criteria. Returned meaningful error messages and set the appropriate HTTP status codes (notably 400 Bad Request) for invalid inputs, and 404 Not Found when modifying non-existent thoughts.
- `Clean Code & Scalability`: 
Followed industry best practices for clarity, maintainability, and scalability. Utilized MongoDB and Mongoose to store and retrieve data, ensuring a stable and flexible database structure.

## `Technologies & Tools`
- `Node.js & Express`: Formed the backbone of the backend logic, efficiently handling routing and server management.
- `MongoDB & Mongoose`: Provided a document-based database solution, simplifying the process of storing, querying, and updating message entries.
- `Testing & Validation`: Leveraged Postman (or similar tools) to test and verify endpoints, ensuring the API behaved as intended and responded correctly under various scenarios.

## View it live

https://project-happy-thoughts-api-h0r6.onrender.com/
