import db from '../models'

exports.getPosts = async (req, res) => {
  const posts = await db.Post.find().sort({ createdAt: -1 }).limit(20).exec()
  if (posts.length > 0) {
    res.json(posts)
  } else {
    res.status(404).json({ message: "No happy thoughts" })
  }
}

exports.createPost = async (req, res) => {
  const { message, name } = req.body
  const post = new db.Post({ message, name })
  try {
    const savedPost = await post.save()
    res.status(201).json(savedPost)
  }
  catch (err) {
    res.status(400).json({ message: "Couldn't save your post", error: err.errors })
  }
}

exports.postLike = async (req, res) => {
  const post = await db.Post.findById(req.params.id)

  if (post) {
    post.hearts += 1
    post.save()
    res.status(201).json(post)
  }
  else {
    res.status(404).json({
      message: `No post with id: ${req.params.id} `, error: err.errors
    })
  }
}