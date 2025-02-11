const express = require('express');
const {
    getAllReceipts,
    getReceiptById,
    updateReceiptDetails,
    deleteReceipt,
    uploadReceipt
} = require('../controllers/receiptController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multerConfig');

const router = express.Router();

router.post('/upload', authMiddleware, upload.single('receiptImage'), uploadReceipt);
router.get('/all', authMiddleware,  getAllReceipts);
router.get('/:receiptId', authMiddleware, getReceiptById);
router.put('/update/:receiptId', authMiddleware, async (req, res, next) => {
    const receipt = await getReceiptById(req.params.receiptId);
    if (!receipt || receipt.user.toString() !== req.user.id) {
        return res.status(403).json({ msg: "❌ Unauthorized: You don't own this receipt!" });
    }
    next();
}, updateReceiptDetails);
router.delete('/delete/:receiptId', authMiddleware, deleteReceipt);

module.exports = router;
