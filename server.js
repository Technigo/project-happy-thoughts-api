import mongoose from 'mongoose'
import app from './src/app.js'

/* Connect to the production database */
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080

/* Start the server */
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
