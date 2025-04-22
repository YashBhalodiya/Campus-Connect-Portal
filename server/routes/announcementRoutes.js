import express from 'express';
import { check } from 'express-validator';
import { 
  getAnnouncements, 
  getAnnouncement, 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement,
  addComment,
  toggleLike
} from '../controllers/announcementController.js';
import { auth, isFaculty } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/announcements
// @desc    Get all announcements
// @access  Public
router.get('/', getAnnouncements);

// @route   GET /api/announcements/:id
// @desc    Get announcement by ID
// @access  Public
router.get('/:id', getAnnouncement);

// @route   POST /api/announcements
// @desc    Create a new announcement
// @access  Private (Faculty only)
router.post(
  '/',
  [
    auth,
    isFaculty,
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty()
  ],
  createAnnouncement
);

// @route   PUT /api/announcements/:id
// @desc    Update an announcement
// @access  Private (Faculty who created the announcement)
router.put(
  '/:id',
  [
    auth,
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty()
  ],
  updateAnnouncement
);

// @route   DELETE /api/announcements/:id
// @desc    Delete an announcement
// @access  Private (Faculty who created the announcement)
router.delete('/:id', auth, deleteAnnouncement);

// @route   POST /api/announcements/:id/comments
// @desc    Add a comment to an announcement
// @access  Private
router.post(
  '/:id/comments',
  [
    auth,
    check('text', 'Comment text is required').not().isEmpty()
  ],
  addComment
);

// @route   POST /api/announcements/:id/like
// @desc    Like or unlike an announcement
// @access  Private
router.post('/:id/like', auth, toggleLike);

export default router;