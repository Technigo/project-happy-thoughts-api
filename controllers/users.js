import db from '../models'
import bcrypt from 'bcrypt-nodejs'

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const user = new db.User({ name, email, password: bcrypt.hashSync(password) })
    const saved = await user.save()
    res.status(201).json({ userId: saved._id, accessToken: saved.accessToken })
  } catch (err) {
    res.status(400).json({ message: 'could not create user', error: err.errors })
  }
}

exports.getUser = async (req, res) => {
  const user = await db.User.findById(req.params.id)
  res.json({ secret: `Welcome to the Jungle!! ${user.name}` })
}

exports.showMessages = async (req, res) => {
  const user = await db.User.findOne({
    accessToken: req.header('Authorization')
  })
  const messages = await db.Message.find({ postedBy: user._id })
  // .sort({ createdAt: -1 }).exec()
  if (messages.length > 0) {
    res.json(messages)
  } else {
    res.status(404).json({ message: "No messages yet" })
  }
}