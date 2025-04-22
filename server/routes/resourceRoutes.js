import express from 'express';
import { check } from 'express-validator';
import { 
  getResources, 
  getResource, 
  createResource, 
  updateResource, 
  deleteResource,
  addComment,
  toggleLike
} from '../controllers/resourceController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/resources
// @desc    Get all resources
// @access  Public
router.get('/', getResources);

// @route   GET /api/resources/:id
// @desc    Get resource by ID
// @access  Public
router.get('/:id', getResource);

// @route   POST /api/resources
// @desc    Create a new resource
// @access  Private
router.post(
  '/',
  [
    auth,
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('fileUrl', 'File URL is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty()
  ],
  createResource
);

// @route   PUT /api/resources/:id
// @desc    Update a resource
// @access  Private (User who uploaded the resource)
router.put(
  '/:id',
  [
    auth,
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('fileUrl', 'File URL is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty()
  ],
  updateResource
);

// @route   DELETE /api/resources/:id
// @desc    Delete a resource
// @access  Private (User who uploaded the resource)
router.delete('/:id', auth, deleteResource);

// @route   POST /api/resources/:id/comments
// @desc    Add a comment to a resource
// @access  Private
router.post(
  '/:id/comments',
  [
    auth,
    check('text', 'Comment text is required').not().isEmpty()
  ],
  addComment
);

// @route   POST /api/resources/:id/like
// @desc    Like or unlike a resource
// @access  Private
router.post('/:id/like', auth, toggleLike);

export default router;