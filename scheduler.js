const cron = require('node-cron');
const { sendWarrantyReminders } = require('./controllers/warrantyReminderController');

// Schedule job to run every day at 9 AM
cron.schedule('0 9 * * *', () => {
    console.log('🔔 Running daily warranty reminder job...');
    sendWarrantyReminders();
}, {
    timezone: 'Asia/Kolkata' // Adjust to your time zone
});
