import db from '../models'

exports.getMessages = async (req, res) => {
  const messages = await db.Message.find().sort({ createdAt: -1 }).limit(20).exec()
  if (messages.length > 0) {
    res.json(messages)
  } else {
    res.status(404).json({ message: "No messages yet" })
  }
}

exports.createMessage = async (req, res) => {
  const { message } = req.body
  const user = await db.User.findOne({
    accessToken: req.header('Authorization')
  })
  const newMessage = new db.Message({ message, postedBy: user._id })
  try {
    const savedMessage = await newMessage.save()
    res.status(201).json(savedMessage)
  }
  catch (err) {
    res.status(400).json({ message: "Couldn't save your message, try again later", error: err.errors })
  }
}

exports.getMessage = async (req, res) => {
  const id = req.params.id
  const message = await db.Message.findById(id)
  if (message) {
    res.json(message)
  } else {
    res.status(404).json({ message: "No such message" })
  }
}

exports.updateMessage = async (req, res) => {
  const id = req.params.id
  const newMessage = req.body.message
  const message = await db.Message.findById(id)
  if (message) {
    message.message = newMessage
    message.save()
    res.status(201).json(message)
  } else {
    res.status(404).json({ message: "No such message" })
  }
}

exports.deleteMessage = async (req, res) => {
  try {
    await db.Message.findOneAndDelete({ _id: req.params.id })
    res.status(202).json({ message: "deleted" })
  } catch (err) {
    res.status(404).json({
      message: "Can't delete the message", error: err.errors
    })
  }
}

exports.like = async (req, res) => {
  const message = await db.Message.findById(req.params.id)

  if (message) {
    message.likes += 1
    message.save()
    res.status(201).json(message)
  }
  else {
    res.status(404).json({
      message: "No such message", error: err.errors
    })
  }
}