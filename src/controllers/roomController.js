const Room = require('../models/Room');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Private
const getRooms = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'Admin' && req.user.hotelId) {
      query.hotelId = req.user.hotelId;
    }
    const rooms = await Room.find(query).populate('hotelId', 'name');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private/Admin/Manager
const createRoom = async (req, res) => {
  const { hotelId, roomNumber, type, maxOccupancy, status, pricePerNight } = req.body;

  try {
    const room = new Room({
      hotelId,
      roomNumber,
      type,
      maxOccupancy: parseInt(maxOccupancy) || 2,
      status: status || 'available',
      pricePerNight: parseFloat(pricePerNight) || 0,
      createdBy: req.user._id,
    });

    const createdRoom = await room.save();
    res.status(201).json(createdRoom);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a room status
// @route   PUT /api/rooms/:id/status
// @access  Private/Admin/Manager/Receptionist
const updateRoomStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      room.status = status;
      const updatedRoom = await room.save();
      res.json(updatedRoom);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin/Manager
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      await Room.deleteOne({ _id: room._id });
      res.json({ message: 'Room removed' });
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRooms,
  createRoom,
  updateRoomStatus,
  deleteRoom,
};
