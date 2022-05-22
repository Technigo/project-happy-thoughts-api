# Project Happy Thoughts API
This assignment was to build an API with 3 endpoints using Mongoose schema for validations and return error message if criterias not met. One endpoint to post a thought, one endpoint to display maximum 20 thoughts per page using pagination and finally one endpoint to update likes for particular thought with findByIdAndUpdate. Then apply this API to our HAPPY THOUGHTS frontend repository.

## The problem
The backend API went rather smooth, but I had some trouble when trying to implement the API to my frontend. I googled and looked into stackoverflow as I first thought it was a failure in connection between MongoDB and Heroku. Redeploying several times to Heroku. Then at last I looked into a classmates code and I did realize that my data for displaying the list in my frontend was missing .response.

## View it live
Backend - https://api-thoughts-happy.herokuapp.com/
Frontend - https://clinquant-figolla-2cfc28.netlify.app/
