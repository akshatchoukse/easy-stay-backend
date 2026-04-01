const express = require('express');
const router = express.Router();
const {
  getRooms,
  createRoom,
  updateRoomStatus,
  deleteRoom,
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getRooms);

// Admin / Manager routes
router.post(
  '/',
  protect,
  authorize('Admin', 'Manager'),
  createRoom
);
router.put(
  '/:id/status',
  protect,
  authorize('Admin', 'Manager', 'Receptionist'),
  updateRoomStatus
);
router.delete('/:id', protect, authorize('Admin', 'Manager'), deleteRoom);

module.exports = router;
