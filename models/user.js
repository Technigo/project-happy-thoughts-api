import mongoose from 'mongoose'
import crypto from 'crypto'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true
    },
    email: {
      type: String,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    accessToken: {
      type: String,
      default: () => crypto.randomBytes(128).toString('hex')
    }
  }
)

const User = mongoose.model('User', userSchema)

module.exports = User