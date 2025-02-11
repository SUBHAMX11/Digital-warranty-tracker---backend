const Receipt = require('../models/Receipt');

exports.uploadReceipt = async (req, res) => {
    try {
        if (!req.file || !req.body.purchaseDate || !req.body.warrantyPeriod) {
            return res.status(400).json({ msg: 'All fields are required' });
        }

        const { purchaseDate, warrantyPeriod } = req.body;

        const expiryDate = new Date(purchaseDate);
        expiryDate.setMonth(expiryDate.getMonth() + parseInt(warrantyPeriod));

        const receipt = new Receipt({
            user: req.user,
            imageUrl: req.file.path, // Cloudinary URL
            purchaseDate: new Date(purchaseDate),
            warrantyPeriod: parseInt(warrantyPeriod),
            expiryDate
        });

        await receipt.save();

        res.status(201).json({ msg: 'Receipt uploaded successfully', receipt });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getAllReceipts = async (req, res) => {
    try {
        const receipts = await Receipt.find({ user: req.user }).sort({ createdAt: -1 });
        res.json(receipts);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getReceiptById = async (req, res) => {
    try {
        const receipt = await Receipt.findById(req.params.receiptId).populate('user', 'email name');
        if (!receipt) return res.status(404).json({ msg: "❌ Receipt Not Found" });

        // Ensure user can only access their own receipts
        if (receipt.user._id.toString() !== req.user.id) {
            return res.status(403).json({ msg: "❌ Unauthorized: You don't own this receipt!" });
        }

        res.json(receipt);
    } catch (err) {
        res.status(500).json({ msg: "❌ Server Error", error: err.message });
    }
};

exports.updateReceiptDetails = async (req, res) => {
    try {
        const { purchaseDate, warrantyPeriod } = req.body;

        // Log incoming request
        console.log("Updating receipt:", req.params.receiptId);
        console.log("Received data:", req.body);

        if (!purchaseDate || !warrantyPeriod) {
            return res.status(400).json({ msg: 'Both purchaseDate and warrantyPeriod are required' });
        }

        const receipt = await Receipt.findOne({ _id: req.params.receiptId, user: req.user });

        if (!receipt) {
            return res.status(404).json({ msg: 'Receipt not found' });
        }

        // Calculate expiry date
        const expiryDate = new Date(purchaseDate);
        expiryDate.setMonth(expiryDate.getMonth() + parseInt(warrantyPeriod));

        receipt.purchaseDate = new Date(purchaseDate);
        receipt.warrantyPeriod = parseInt(warrantyPeriod);
        receipt.expiryDate = expiryDate;

        await receipt.save();
        res.json({ msg: 'Receipt updated successfully', receipt });
    } catch (err) {
        console.error("Error in updateReceiptDetails:", err.message); // Log error
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};


exports.deleteReceipt = async (req, res) => {
    try {
        const receipt = await Receipt.findOneAndDelete({ _id: req.params.receiptId, user: req.user });

        if (!receipt) {
            return res.status(404).json({ msg: 'Receipt not found' });
        }

        res.json({ msg: 'Receipt deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};
