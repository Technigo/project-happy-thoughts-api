import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/authAPI"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

module.exports.User = require('./user')
module.exports.Message = require('./message')