const express = require('express');
const router = express.Router();
const Ship = require('../models/Ship');
const auth = require('../middleware/auth');

// @route   GET /api/ships
// @desc    Get all ships with pagination, filtering, and search
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    // Status filter
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }
    
    // Type filter
    if (req.query.type && req.query.type !== 'all') {
      filter.type = req.query.type;
    }
    
    // Search filter
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { 'crew.captain': { $regex: req.query.search, $options: 'i' } },
        { 'location.currentPort': { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Sort options
    let sort = {};
    if (req.query.sortBy) {
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      sort[req.query.sortBy] = sortOrder;
    } else {
      sort = { createdAt: -1 }; // Default sort by creation date
    }
    
    // Execute query with pagination
    const ships = await Ship.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-__v');
    
    // Get total count for pagination
    const total = await Ship.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    
    res.json({ 
      message: 'Ships retrieved successfully',
      ships,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get ships error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/ships
// @desc    Create a new ship
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, capacity, status, specifications, crew, location, maintenance } = req.body;
    
    // Basic validation
    if (!name || !type || !capacity) {
      return res.status(400).json({ 
        message: 'Please provide ship name, type, and capacity',
        required: ['name', 'type', 'capacity']
      });
    }
    
    // Create new ship
    const ship = new Ship({
      name,
      type,
      capacity,
      status: status || 'Active',
      specifications,
      crew,
      location,
      maintenance
    });
    
    await ship.save();
    
    res.status(201).json({ 
      message: 'Ship created successfully',
      ship
    });
  } catch (error) {
    console.error('Create ship error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/ships/:id
// @desc    Get ship by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const ship = await Ship.findById(id).select('-__v');
    if (!ship) {
      return res.status(404).json({ message: 'Ship not found' });
    }
    
    res.json({ 
      message: 'Ship retrieved successfully',
      ship
    });
  } catch (error) {
    console.error('Get ship error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid ship ID format' });
    }
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/ships/:id
// @desc    Update ship by ID
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Remove calculated fields from update data
    delete updateData.efficiency;
    delete updateData.operationalDays;
    
    const ship = await Ship.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!ship) {
      return res.status(404).json({ message: 'Ship not found' });
    }
    
    res.json({ 
      message: 'Ship updated successfully',
      ship
    });
  } catch (error) {
    console.error('Update ship error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid ship ID format' });
    }
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/ships/:id
// @desc    Delete ship by ID
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const ship = await Ship.findByIdAndDelete(id);
    if (!ship) {
      return res.status(404).json({ message: 'Ship not found' });
    }
    
    res.json({ 
      message: 'Ship deleted successfully',
      shipId: id
    });
  } catch (error) {
    console.error('Delete ship error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid ship ID format' });
    }
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/ships/stats/overview
// @desc    Get fleet statistics overview
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    const totalShips = await Ship.countDocuments();
    const activeShips = await Ship.countDocuments({ status: 'Active' });
    const maintenanceShips = await Ship.countDocuments({ status: 'Maintenance' });
    const dockedShips = await Ship.countDocuments({ status: 'Docked' });
    
    // Calculate average efficiency
    const efficiencyStats = await Ship.aggregate([
      { $group: { _id: null, avgEfficiency: { $avg: '$efficiency' } } }
    ]);
    
    const avgEfficiency = efficiencyStats.length > 0 ? Math.round(efficiencyStats[0].avgEfficiency) : 0;
    
    res.json({
      message: 'Fleet statistics retrieved successfully',
      stats: {
        totalShips,
        activeShips,
        maintenanceShips,
        dockedShips,
        avgEfficiency
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router; 