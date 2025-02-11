const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productName: { type: String, required: true },
    purchaseDate: { type: Date, required: true },
    warrantyPeriod: { type: Number, required: true }, // In months
    expiryDate: { type: Date, required: true },
    storeName: { type: String },  // Optional - Store where it was bought
    receiptImage: { type: String }, // Cloudinary Image URL
    status: { type: String, enum: ['active', 'expired'], default: 'active' }
});

module.exports = mongoose.model('Receipt', receiptSchema);
