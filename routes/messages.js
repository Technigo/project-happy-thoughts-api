import express from 'express'
const router = express.Router()
import auth from '../util/auth'

import controllers from '../controllers/messages'

router.route('/')
  .get(auth, controllers.getMessages)
  .post(auth, controllers.createMessage)

router.route('/:id')
  .get(auth, controllers.getMessage)
  .put(auth, controllers.updateMessage)
  .delete(auth, controllers.deleteMessage)

router.route('/:id/like')
  .post(auth, controllers.like)

export default router