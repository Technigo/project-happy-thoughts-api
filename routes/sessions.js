import express from 'express'
const router = express.Router()

import controllers from '../controllers/sessions'

router.route('/')
  .post(controllers.login)

export default router