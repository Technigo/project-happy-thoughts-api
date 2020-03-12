import express from 'express'
const router = express.Router()
import auth from '../util/auth'

import {
  createUser,
  showMessages,
  getUser
} from '../controllers/users'

router.route('/')
  .post(createUser)

router.route('/messages')
  .get(auth, showMessages)

router.route('/:id')
  .get(auth, getUser)

export default router