const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    available: {
      type: Number,
      required: true,
      default: 0,
    },
    inRooms: {
      type: Number,
      required: true,
      default: 0,
    },
    inLaundry: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
