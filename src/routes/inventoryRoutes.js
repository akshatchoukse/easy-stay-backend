const express = require('express');
const router = express.Router();
const {
  getInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(protect, getInventory)
  .post(protect, authorize('Admin', 'Manager'), createInventoryItem);

router
  .route('/:id')
  .put(protect, authorize('Admin', 'Manager', 'Housekeeping'), updateInventoryItem)
  .delete(protect, authorize('Admin', 'Manager'), deleteInventoryItem);

module.exports = router;
