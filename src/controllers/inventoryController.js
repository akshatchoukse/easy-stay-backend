const Inventory = require('../models/Inventory');

// @desc    Get inventory items
// @route   GET /api/inventory
// @access  Private
const getInventory = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'Admin') {
      if (req.user.hotelId) {
        query.hotel = req.user.hotelId;
      }
    } else if (req.query.hotelId && req.query.hotelId !== 'all') {
      query.hotel = req.query.hotelId;
    }

    const items = await Inventory.find(query).populate('hotel', 'name');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an inventory item
// @route   POST /api/inventory
// @access  Private/Admin/Manager
const createInventoryItem = async (req, res) => {
  const { name, hotelId, available, inRooms, inLaundry } = req.body;

  try {
    const item = new Inventory({
      name,
      hotel: hotelId || req.user.hotelId,
      available: available || 0,
      inRooms: inRooms || 0,
      inLaundry: inLaundry || 0
    });

    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an inventory item
// @route   PUT /api/inventory/:id
// @access  Private/Admin/Manager/Housekeeping
const updateInventoryItem = async (req, res) => {
  const { name, hotelId, available, inRooms, inLaundry } = req.body;

  try {
    const item = await Inventory.findById(req.params.id);

    if (item) {
      item.name = name || item.name;
      item.hotel = hotelId || item.hotel;
      item.available = available !== undefined ? available : item.available;
      item.inRooms = inRooms !== undefined ? inRooms : item.inRooms;
      item.inLaundry = inLaundry !== undefined ? inLaundry : item.inLaundry;

      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an inventory item
// @route   DELETE /api/inventory/:id
// @access  Private/Admin/Manager
const deleteInventoryItem = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (item) {
      await Inventory.deleteOne({ _id: item._id });
      res.json({ message: 'Item removed' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
};
