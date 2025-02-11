const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: '' }, // URL of user's profile picture
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Role-based access
    isVerified: { type: Boolean, default: false }, // Email verification status
    status: { type: String, enum: ['active', 'banned', 'pending'], default: 'active' }, // Account status
    createdAt: { type: Date, default: Date.now }, // Timestamp
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
