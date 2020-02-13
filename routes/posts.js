import express from 'express'
const router = express.Router()

import helpers from '../helpers/posts'

router.route('/')
  .get(helpers.getPosts)
  .post(helpers.createPost)

router.route('/:id/like')
  .post(helpers.postLike)

export default router