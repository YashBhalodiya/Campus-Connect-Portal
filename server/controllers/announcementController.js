import { validationResult } from 'express-validator';
import Announcement from '../models/Announcement.js';

// Get all announcements
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email role')
      .populate('comments.createdBy', 'name email role');
    
    res.status(200).json(announcements);
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single announcement
export const getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('comments.createdBy', 'name email role')
      .populate('likes', 'name');
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    res.status(200).json(announcement);
  } catch (error) {
    console.error('Get announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new announcement
export const createAnnouncement = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;

    // Create new announcement
    const announcement = new Announcement({
      title,
      description,
      createdBy: req.user.id
    });

    await announcement.save();
    
    // Populate the createdBy field before sending response
    const populatedAnnouncement = await Announcement.findById(announcement._id)
      .populate('createdBy', 'name email role');
    
    res.status(201).json(populatedAnnouncement);
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an announcement
export const updateAnnouncement = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;

    // Find the announcement
    let announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    // Check if user is authorized to update
    if (announcement.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this announcement' });
    }
    
    // Update announcement
    announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    ).populate('createdBy', 'name email role')
      .populate('comments.createdBy', 'name email role');
    
    res.status(200).json(announcement);
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    // Find the announcement
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    // Check if user is authorized to delete
    if (announcement.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this announcement' });
    }
    
    await Announcement.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a comment to an announcement
export const addComment = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text } = req.body;

    // Find the announcement
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    // Add comment
    announcement.comments.unshift({
      text,
      createdBy: req.user.id
    });
    
    await announcement.save();
    
    // Populate the updated announcement
    const updatedAnnouncement = await Announcement.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('comments.createdBy', 'name email role');
    
    res.status(200).json(updatedAnnouncement);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle like on an announcement
export const toggleLike = async (req, res) => {
  try {
    // Find the announcement
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    
    // Check if the user has already liked the announcement
    const likeIndex = announcement.likes.findIndex(
      like => like.toString() === req.user.id
    );
    
    // If already liked, remove like
    if (likeIndex !== -1) {
      announcement.likes.splice(likeIndex, 1);
    } else {
      // Otherwise, add like
      announcement.likes.push(req.user.id);
    }
    
    await announcement.save();
    
    // Populate the updated announcement
    const updatedAnnouncement = await Announcement.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('comments.createdBy', 'name email role')
      .populate('likes', 'name');
    
    res.status(200).json(updatedAnnouncement);
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};