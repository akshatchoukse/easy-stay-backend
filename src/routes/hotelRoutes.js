const express = require('express');
const router = express.Router();
const {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  deleteHotelImage,
} = require('../controllers/hotelController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getHotels);
router.get('/test-hotels', (req, res) => res.json({ message: "hotels test" }));
router.get('/:id', getHotelById);

// Admin / Manager routes
router.post(
  '/',
  protect,
  authorize('Admin', 'Manager'),
  upload.array('images', 10),
  createHotel
);
router.put(
  '/:id',
  protect,
  authorize('Admin', 'Manager'),
  upload.array('images', 10),
  updateHotel
);
router.delete('/:id', protect, authorize('Admin', 'Manager'), deleteHotel);
router.post('/:id/remove-image', protect, authorize('Admin', 'Manager'), deleteHotelImage);

module.exports = router;
