import express from 'express'
const router = express.Router()
import auth from '../util/auth'

import {
  getMessages,
  createMessage,
  getMessage,
  updateMessage,
  deleteMessage,
  like
} from '../controllers/messages'

router.route('/')
  .get(auth, getMessages)
  .post(auth, createMessage)

router.route('/:id')
  .get(auth, getMessage)
  .put(auth, updateMessage)
  .delete(auth, deleteMessage)

router.route('/:id/like')
  .post(auth, like)

export default router