const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (req, res) => {
  const body = req.body
  const user = req.user

  if (!user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const savedBlogWithUser = await savedBlog.populate('user', { username: 1, name: 1 })
  res.status(201).json(savedBlogWithUser)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  if (!req.user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  if (blog.user.toString() !== req.user.id.toString()) {
    return res.status(403).json({ error: 'only the creator can delete this blog' })
  }
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', middleware.userExtractor, async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' })
  }

  if (!req.user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  if (blog.user.toString() !== req.user.id.toString()) {
    return res.status(403).json({ error: 'only the creator can update this blog' })
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('user', { username: 1, name: 1 })
  res.json(updatedBlog)
})

module.exports = blogsRouter
