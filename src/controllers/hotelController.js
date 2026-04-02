const Hotel = require('../models/Hotel');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({}).populate('createdBy', 'name email');
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ message: 'Hotel not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a hotel
// @route   POST /api/hotels
// @access  Private/Admin
const createHotel = async (req, res) => {
  const { name, description, address, city, state, pincode, phone, whatsappNumber, mapLink, embedMapLink, amenities, startingPrice, coverIndex } = req.body;

  try {
    const hotel = new Hotel({
      name,
      description,
      address,
      city,
      state,
      pincode,
      phone,
      whatsappNumber,
      mapLink,
      embedMapLink,
      amenities: (amenities && amenities.trim() !== '') ? JSON.parse(amenities) : [],
      startingPrice: parseFloat(startingPrice) || 0,
      createdBy: req.user._id,
      images: req.files
        ? req.files.map((file, i) => ({
            url: file.path,
            public_id: file.filename,
            isCover: i === parseInt(coverIndex || 0),
          }))
        : [],
    });

    const createdHotel = await hotel.save();
    res.status(201).json(createdHotel);
  } catch (error) {
    console.error('Create hotel error:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
const updateHotel = async (req, res) => {
  const { name, description, address, city, state, pincode, phone, whatsappNumber, mapLink, embedMapLink, amenities, startingPrice, coverIndex } = req.body;

  try {
    const hotel = await Hotel.findById(req.params.id);

    if (hotel) {
      // Check if user is the creator or Admin
      if (
        hotel.createdBy.toString() !== req.user._id.toString() &&
        req.user.role !== 'Admin'
      ) {
        return res
          .status(403)
          .json({ message: 'Not authorized to update this hotel' });
      }

      hotel.name = name || hotel.name;
      hotel.description = description || hotel.description;
      hotel.address = address || hotel.address;
      hotel.city = city || hotel.city;
      hotel.state = state || hotel.state;
      hotel.pincode = pincode || hotel.pincode;
      hotel.phone = phone || hotel.phone;
      hotel.whatsappNumber = whatsappNumber || hotel.whatsappNumber;
      hotel.mapLink = mapLink || hotel.mapLink;
      hotel.embedMapLink = embedMapLink !== undefined ? embedMapLink : hotel.embedMapLink;
      hotel.startingPrice = startingPrice !== undefined ? (parseFloat(startingPrice) || 0) : hotel.startingPrice;
      hotel.amenities = (amenities && amenities.trim() !== '') ? JSON.parse(amenities) : hotel.amenities;

      if (req.files && req.files.length > 0) {
        const newImages = req.files.map((file) => ({
          url: file.path,
          public_id: file.filename,
          isCover: false,
        }));
        hotel.images = [...hotel.images, ...newImages];
      }

      // Update cover image
      if (coverIndex !== undefined) {
        const idx = parseInt(coverIndex);
        hotel.images.forEach((img, i) => {
          img.isCover = (i === idx);
        });
      }

      const updatedHotel = await hotel.save();
      res.json(updatedHotel);
    } else {
      res.status(404).json({ message: 'Hotel not found' });
    }
  } catch (error) {
    console.error('Update hotel error:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (hotel) {
      if (
        hotel.createdBy.toString() !== req.user._id.toString() &&
        req.user.role !== 'Admin'
      ) {
        return res
          .status(403)
          .json({ message: 'Not authorized to delete this hotel' });
      }

      // Delete images from cloudinary
      if (hotel.images && hotel.images.length > 0) {
        const deletePromises = hotel.images.map((img) =>
          cloudinary.uploader.destroy(img.public_id)
        );
        await Promise.all(deletePromises);
      }

      await Hotel.deleteOne({ _id: hotel._id });
      res.json({ message: 'Hotel removed' });
    } else {
      res.status(404).json({ message: 'Hotel not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete hotel image
// @route   POST /api/hotels/:id/remove-image
// @access  Private/Admin
const deleteHotelImage = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    // Check if user is the creator or Admin
    if (
      hotel.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this hotel' });
    }

    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ message: 'public_id is required' });

    const imageToDelete = hotel.images.find(img => img.public_id === public_id);

    if (imageToDelete) {
      // Delete from cloudinary
      await cloudinary.uploader.destroy(public_id);
      // Remove from hotel images array
      hotel.images = hotel.images.filter(img => img.public_id !== public_id);
      
      // If the deleted image was a cover, make the first one a cover if exists
      if (imageToDelete.isCover && hotel.images.length > 0) {
        hotel.images[0].isCover = true;
      }

      await hotel.save();
      res.json({ message: 'Image deleted', images: hotel.images });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  deleteHotelImage,
};
