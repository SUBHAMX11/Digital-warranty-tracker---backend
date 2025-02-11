const Receipt = require('../models/Receipt');
const sendEmail = require('../services/emailService');

exports.sendWarrantyReminders = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        console.log(`🔍 Checking for warranties expiring within the next 7 days...`);

        const upcomingExpirations = await Receipt.find({
            expiryDate: { $gte: today, $lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) } // Next 7 days
        }).populate('user', 'email name');

        console.log(`📌 Found ${upcomingExpirations.length} receipts expiring soon.`);

        if (upcomingExpirations.length === 0) {
            console.log('🚨 No warranties expiring in the next 7 days.');
            return;
        }

        for (const receipt of upcomingExpirations) {
            console.log(`📧 Sending reminder email to: ${receipt.user.email}`);

            const emailText = `Hello ${receipt.user.name},\n\nYour warranty for the product purchased on ${receipt.purchaseDate.toDateString()} is expiring on ${receipt.expiryDate.toDateString()}.\n\nPlease take necessary actions.\n\nBest Regards,\nWarranty Tracker Team`;

            await sendEmail(receipt.user.email, 'Warranty Expiry Reminder', emailText);

            console.log(`✅ Email sent successfully to ${receipt.user.email}`);
        }

        console.log('✅ Warranty expiry reminders sent!');
    } catch (err) {
        console.error('❌ Error in sending warranty reminders:', err.message);
    }
};

