import express from 'express';
import { check } from 'express-validator';
import { 
  getEvents, 
  getEvent, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  registerForEvent,
  cancelRegistration,
  addComment
} from '../controllers/eventController.js';
import { auth, isFaculty } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', getEvents);

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', getEvent);

// @route   POST /api/events
// @desc    Create a new event
// @access  Private (Faculty only)
router.post(
  '/',
  [
    auth,
    isFaculty,
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('date', 'Date is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty()
  ],
  createEvent
);

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private (Faculty who created the event)
router.put(
  '/:id',
  [
    auth,
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('date', 'Date is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty()
  ],
  updateEvent
);

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private (Faculty who created the event)
router.delete('/:id', auth, deleteEvent);

// @route   POST /api/events/:id/register
// @desc    Register for an event
// @access  Private
router.post('/:id/register', auth, registerForEvent);

// @route   POST /api/events/:id/cancel
// @desc    Cancel registration for an event
// @access  Private
router.post('/:id/cancel', auth, cancelRegistration);

// @route   POST /api/events/:id/comments
// @desc    Add a comment to an event
// @access  Private
router.post(
  '/:id/comments',
  [
    auth,
    check('text', 'Comment text is required').not().isEmpty()
  ],
  addComment
);

export default router;