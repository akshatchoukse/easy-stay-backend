const mongoose = require('mongoose');

const roomSchema = mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['AC', 'Non-AC'],
      default: 'AC',
    },
    maxOccupancy: {
      type: Number,
      required: true,
      default: 2,
    },
    status: {
      type: String,
      required: true,
      enum: ['available', 'occupied', 'cleaning', 'dirty'],
      default: 'available',
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
