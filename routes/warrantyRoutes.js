const express = require('express');
const { sendWarrantyReminders } = require('../controllers/warrantyReminderController');
const router = express.Router();

router.get('/send-reminders', async (req, res) => {
    try {
        await sendWarrantyReminders();
        res.json({ msg: 'Warranty reminder emails sent successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Error sending reminders', error: err.message });
    }
});

module.exports = router;
