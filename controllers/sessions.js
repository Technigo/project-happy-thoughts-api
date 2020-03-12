import db from '../models'
import bcrypt from 'bcrypt-nodejs'

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await db.User.findOne({ email })
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(201).json({ userId: user._id, accessToken: user.accessToken })
    } else {
      throw new Error('could not find user')
    }
  } catch (err) {
    res.status(400).json({ message: 'could not find user', errors: err.errors })
  }
}