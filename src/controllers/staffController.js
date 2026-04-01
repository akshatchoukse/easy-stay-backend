const User = require('../models/User');

// @desc    Get all staff
// @route   GET /api/staff
// @access  Private/Admin
const getStaff = async (req, res) => {
  try {
    let query = {};
    
    // Filter to exclude 'Admin' role users?
    // User role Admin is not authorized to access this route message showed Admin with capital A
    // But for now, let's just get everything except maybe the current admin?
    // query.role = { $ne: 'Admin' };
    
    if (req.user.role !== 'Admin') {
      if (req.user.hotelId) {
        query.hotelId = req.user.hotelId;
      }
    }

    const staff = await User.find(query).populate('hotelId', 'name');
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a staff member (User)
// @route   POST /api/staff
// @access  Private/Admin
const createStaff = async (req, res) => {
  const { name, email, password, role, phone, salary, hotelId, status } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = new User({
      name,
      email,
      password, // Password will be hashed by pre-save middleware in User model
      role,
      phone,
      salary,
      hotelId,
      status: status || 'active'
    });

    const createdStaff = await user.save();
    
    // Don't send password back
    createdStaff.password = undefined;
    res.status(201).json(createdStaff);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a staff member
// @route   PUT /api/staff/:id
// @access  Private/Admin
const updateStaff = async (req, res) => {
  const { name, email, password, role, phone, salary, hotelId, status } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      if (password) {
        user.password = password; // Will be hashed by pre-save hook
      }
      user.role = role || user.role;
      user.phone = phone !== undefined ? phone : user.phone;
      user.salary = salary !== undefined ? salary : user.salary;
      user.hotelId = hotelId || user.hotelId;
      user.status = status || user.status;

      const updatedStaff = await user.save();
      updatedStaff.password = undefined;
      res.json(updatedStaff);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a staff member
// @route   DELETE /api/staff/:id
// @access  Private/Admin
const deleteStaff = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Don't allow deleting yourself? Or the main Admin?
      if (user._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'You cannot delete yourself' });
      }

      await User.deleteOne({ _id: user._id });
      res.json({ message: 'Staff member removed' });
    } else {
      res.status(404).json({ message: 'Staff member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
};
