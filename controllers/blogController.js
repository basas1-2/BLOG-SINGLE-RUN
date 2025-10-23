const { validationResult } = require('express-validator');
const Blog = require('../models/Blog');

exports.getAll = async (req, res) => {
  try {
    const posts = await Blog.find().populate('author', 'name').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getOne = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id).populate('author', 'name email');
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { title, body } = req.body;
    const imageUrl = req.file ? ('/uploads/' + req.file.filename) : undefined;
    const post = new Blog({ title, body, imageUrl, author: req.user.id });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.update = async (req, res) => {
  try {
    const { title, body } = req.body;
    const update = { updatedAt: Date.now() };
    if (title) update.title = title;
    if (body) update.body = body;
    if (req.file) update.imageUrl = '/uploads/' + req.file.filename;

    let post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });

    post = await Blog.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.remove = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ msg: 'Not authorized' });

    await post.remove();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getMine = async (req, res) => {
  try {
    const posts = await Blog.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
