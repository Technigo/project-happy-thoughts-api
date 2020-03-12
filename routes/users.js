import express from 'express'
const router = express.Router()
import auth from '../util/auth'

import controllers from '../controllers/users'

router.route('/')
  .post(controllers.createUser)

router.route('/messages')
  .get(auth, controllers.showMessages)

router.route('/:id')
  .get(auth, controllers.getUser)

export default router