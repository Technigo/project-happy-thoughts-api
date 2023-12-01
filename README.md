# Project Happy Thoughts API

This project is a MongoDB API that manages a collection of happy thoughts and serves as the backend for a Happy Thoughts project.
Users can retrieve a list of 20 newest happy thoughts, post new happy thoughts, and like existing ones.
The API is built using:

- Node.js,
- Express.js,
- MongoDB Atlas as the database,
- and Mongoose as the ODM (Object Data Modeling) library.

## The problem

I first used mongoose following function: findByIdAndUpdate() to increment the number of likes on a specific happy thought (by id), but the former value was returned for some reason I did not understand, as the documentation (https://mongoosejs.com/docs/api/model.html#Model.findByIdAndUpdate()) specifies that a third option can be passed in the fucntion: `[options.new=false]«Boolean» if true, return the modified document rather than the original`
I went back to using a more traditional approach with findById() and save() functions instead.

I nevertheless found some articles about this hurdle:
https://www.codingninjas.com/studio/library/findbyidandupdate-function
https://medium.com/@findingalberta/what-the-fffff-findbyidandupdate-mongoose-107219d5f90
and would have tried this if given more time.

## View it live

Deployed front-end: https://lambent-fudge-cba686.netlify.app/
Deployed back-end: https://project-happy-thoughts-api-v453.onrender.com
