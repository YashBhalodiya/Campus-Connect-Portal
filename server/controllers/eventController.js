import { validationResult } from 'express-validator';
import Event from '../models/Event.js';

// Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: 1 })
      .populate('createdBy', 'name email role');
    
    res.status(200).json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single event
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('registeredUsers', 'name email role')
      .populate('comments.createdBy', 'name email role')
      .populate('likes', 'name');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new event
export const createEvent = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, date, location, registrationLimit } = req.body;

    // Create new event
    const event = new Event({
      title,
      description,
      date,
      location,
      registrationLimit: registrationLimit || 0,
      createdBy: req.user.id
    });

    await event.save();
    
    // Populate the createdBy field before sending response
    const populatedEvent = await Event.findById(event._id)
      .populate('createdBy', 'name email role');
    
    res.status(201).json(populatedEvent);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update an event
export const updateEvent = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, date, location, registrationLimit } = req.body;

    // Find the event
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is authorized to update
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this event' });
    }
    
    // Update event
    event = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, date, location, registrationLimit },
      { new: true }
    ).populate('createdBy', 'name email role')
      .populate('registeredUsers', 'name email role');
    
    res.status(200).json(event);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  try {
    // Find the event
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is authorized to delete
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this event' });
    }
    
    await Event.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Register for an event
export const registerForEvent = async (req, res) => {
  try {
    // Find the event
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if registration limit has been reached
    if (event.registrationLimit > 0 && 
        event.registeredUsers.length >= event.registrationLimit) {
      return res.status(400).json({ message: 'Registration limit reached' });
    }
    
    // Check if user is already registered
    if (event.registeredUsers.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }
    
    // Add user to registered users
    event.registeredUsers.push(req.user.id);
    await event.save();
    
    // Populate the updated event
    const updatedEvent = await Event.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('registeredUsers', 'name email role');
    
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel registration for an event
export const cancelRegistration = async (req, res) => {
  try {
    // Find the event
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is registered
    const registeredIndex = event.registeredUsers.findIndex(
      user => user.toString() === req.user.id
    );
    
    if (registeredIndex === -1) {
      return res.status(400).json({ message: 'You are not registered for this event' });
    }
    
    // Remove user from registered users
    event.registeredUsers.splice(registeredIndex, 1);
    await event.save();
    
    // Populate the updated event
    const updatedEvent = await Event.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('registeredUsers', 'name email role');
    
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a comment to an event
export const addComment = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text } = req.body;

    // Find the event
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Add comment
    event.comments.unshift({
      text,
      createdBy: req.user.id
    });
    
    await event.save();
    
    // Populate the updated event
    const updatedEvent = await Event.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('comments.createdBy', 'name email role');
    
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};