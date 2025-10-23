const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public: list
router.get('/', blogController.getAll);

// Public: single
router.get('/:id', blogController.getOne);

// Protected: create (with image upload)
router.post('/', auth, upload.single('image'), [
  body('title').notEmpty().withMessage('Title required'),
  body('body').notEmpty().withMessage('Body required')
], blogController.create);

// Protected: update
router.put('/:id', auth, upload.single('image'), blogController.update);

// Protected: delete
router.delete('/:id', auth, blogController.remove);

// Protected: get mine
router.get('/user/me', auth, blogController.getMine);

module.exports = router;
