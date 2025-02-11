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
router.get('/all', authMiddleware, async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: "❌ Access Denied: Admins Only!" });
    }
    next();
}, getAllReceipts);
router.get('/:receiptId', authMiddleware, getReceiptById);
router.put('/update/:receiptId', authMiddleware, async (req, res, next) => {
    const receipt = await getReceiptById(req.params.receiptId);
    if (!receipt || receipt.user.toString() !== req.user.id) {
        return res.status(403).json({ msg: "❌ Unauthorized: You don't own this receipt!" });
    }
    next();
}, updateReceiptDetails);
router.delete('/delete/:receiptId', authMiddleware, async (req, res, next) => {
    const receipt = await getReceiptById(req.params.receiptId);
    if (!receipt || receipt.user.toString() !== req.user.id) {
        return res.status(403).json({ msg: "❌ Unauthorized: You can't delete this receipt!" });
    }
    next();
}, deleteReceipt);

module.exports = router;
