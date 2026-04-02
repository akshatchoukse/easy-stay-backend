const mongoose = require('mongoose');

const hotelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
    },
    pincode: {
      type: String,
    },
    phone: {
      type: String,
    },
    whatsappNumber: {
      type: String,
    },
    mapLink: {
      type: String,
    },
    embedMapLink: {
      type: String,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
        isCover: {
          type: Boolean,
          default: false,
        },
      },
    ],
    amenities: [
      {
        name: { type: String, required: true },
        icon: { type: String }, // Store the React Icon component name or identifier
      },
    ],

    startingPrice: {
      type: Number,
      required: true,
      default: 0,
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

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
