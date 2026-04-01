const express = require('express');
const router = express.Router();
const {
  getExpenses,
  createExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(protect, authorize('Admin', 'Manager'), getExpenses)
  .post(protect, authorize('Admin', 'Manager'), createExpense);

router
  .route('/:id')
  .delete(protect, authorize('Admin'), deleteExpense);

module.exports = router;
