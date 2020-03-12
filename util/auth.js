import db from '../models'

const authenticateUser = async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      accessToken: req.header('Authorization')
    })
    if (user) {
      req.user = user
      next()
    } else {
      res.status(401).json({ loggedOut: true })
    }
  } catch (err) {
    res
      .status(403)
      .json({ message: 'access token missing or wrong', errors: err.errors })
  }
}

export default authenticateUser