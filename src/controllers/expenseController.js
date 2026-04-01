const Expense = require('../models/Expense');

// @desc    Get expenses
// @route   GET /api/expenses
// @access  Private/Admin/Manager
const getExpenses = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'Admin') {
      if (req.user.hotelId) {
        query.hotel = req.user.hotelId;
      }
    }

    const expenses = await Expense.find(query)
      .populate('hotel', 'name')
      .populate('addedBy', 'name')
      .sort({ timestamp: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an expense
// @route   POST /api/expenses
// @access  Private/Admin/Manager
const createExpense = async (req, res) => {
  const { title, amount, hotelId } = req.body;

  try {
    const expense = new Expense({
      title,
      amount,
      hotel: hotelId || req.user.hotelId,
      addedBy: req.user._id,
    });

    const createdExpense = await expense.save();
    
    // Return populated expense
    const populated = await Expense.findById(createdExpense._id)
      .populate('hotel', 'name')
      .populate('addedBy', 'name');
      
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private/Admin
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (expense) {
      await Expense.deleteOne({ _id: expense._id });
      res.json({ message: 'Expense removed' });
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExpenses,
  createExpense,
  deleteExpense,
};
