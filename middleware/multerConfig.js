const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'receipts', // Folder in Cloudinary
        format: async (req, file) => 'png', // Convert all images to PNG
        public_id: (req, file) => `${Date.now()}-${file.originalname}`
    }
});

const upload = multer({ storage });

module.exports = upload;
