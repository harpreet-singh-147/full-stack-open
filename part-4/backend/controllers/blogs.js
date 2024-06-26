const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

blogsRouter.post('/', middleware.userExtractor, async (req, res) => {
  const user = req.user;
  const blog = new Blog({ ...req.body, user: user.id });

  const savedBlog = await blog.save();
  const populatedBlog = await savedBlog.populate('user', {
    username: 1,
    name: 1,
  });

  user.blogs = [...user.blogs, savedBlog._id];
  await user.save();

  res.status(201).json(populatedBlog);
});

blogsRouter.put('/:id', middleware.userExtractor, async (req, res) => {
  let blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }

  const { title, author, url, likes } = req.body;
  const user = req.user;

  blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, author, url, likes },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  ).populate('user', { username: 1, name: 1 });

  user.likedBlogs = [...user.likedBlogs, blog._id];
  await user.save();
  res.status(200).json(blog);
});

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }
  if (blog.user.toString() === req.user.id) {
    await Blog.findByIdAndDelete(req.params.id);
    return res.status(204).end();
  } else {
    return res
      .status(403)
      .json({ error: 'Forbidden: You are not authorized to delete this blog' });
  }
});

module.exports = blogsRouter;
