import { validationResult } from 'express-validator';
import Resource from '../models/Resource.js';

// Get all resources
export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find()
      .sort({ createdAt: -1 })
      .populate('uploadedBy', 'name email role');
    
    res.status(200).json(resources);
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single resource
export const getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('uploadedBy', 'name email role')
      .populate('comments.createdBy', 'name email role')
      .populate('likes', 'name');
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    res.status(200).json(resource);
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new resource
export const createResource = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, fileUrl, category } = req.body;

    // Create new resource
    const resource = new Resource({
      title,
      description,
      fileUrl,
      category,
      uploadedBy: req.user.id
    });

    await resource.save();
    
    // Populate the uploadedBy field before sending response
    const populatedResource = await Resource.findById(resource._id)
      .populate('uploadedBy', 'name email role');
    
    res.status(201).json(populatedResource);
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a resource
export const updateResource = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, fileUrl, category } = req.body;

    // Find the resource
    let resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Check if user is authorized to update
    if (resource.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this resource' });
    }
    
    // Update resource
    resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { title, description, fileUrl, category },
      { new: true }
    ).populate('uploadedBy', 'name email role')
      .populate('comments.createdBy', 'name email role');
    
    res.status(200).json(resource);
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a resource
export const deleteResource = async (req, res) => {
  try {
    // Find the resource
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Check if user is authorized to delete
    if (resource.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this resource' });
    }
    
    await Resource.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a comment to a resource
export const addComment = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text } = req.body;

    // Find the resource
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Add comment
    resource.comments.unshift({
      text,
      createdBy: req.user.id
    });
    
    await resource.save();
    
    // Populate the updated resource
    const updatedResource = await Resource.findById(req.params.id)
      .populate('uploadedBy', 'name email role')
      .populate('comments.createdBy', 'name email role');
    
    res.status(200).json(updatedResource);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle like on a resource
export const toggleLike = async (req, res) => {
  try {
    // Find the resource
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Check if the user has already liked the resource
    const likeIndex = resource.likes.findIndex(
      like => like.toString() === req.user.id
    );
    
    // If already liked, remove like
    if (likeIndex !== -1) {
      resource.likes.splice(likeIndex, 1);
    } else {
      // Otherwise, add like
      resource.likes.push(req.user.id);
    }
    
    await resource.save();
    
    // Populate the updated resource
    const updatedResource = await Resource.findById(req.params.id)
      .populate('uploadedBy', 'name email role')
      .populate('comments.createdBy', 'name email role')
      .populate('likes', 'name');
    
    res.status(200).json(updatedResource);
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};