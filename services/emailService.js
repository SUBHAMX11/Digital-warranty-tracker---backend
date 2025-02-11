require('dotenv').config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

console.log("🔍 Checking .env Variables:");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("GMAIL_CLIENT_ID:", process.env.GMAIL_CLIENT_ID);
console.log("GMAIL_CLIENT_SECRET:", process.env.GMAIL_CLIENT_SECRET);
console.log("GMAIL_REFRESH_TOKEN:", process.env.GMAIL_REFRESH_TOKEN ? "✅ Token Found" : "❌ Token Missing");

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
if (!REFRESH_TOKEN) {
    console.error("❌ No Refresh Token Found. Make sure it's set in .env!");
    process.exit(1);
}

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


const sendEmail = async (to, subject, text) => {
    try {
        console.log(`📧 Attempting to send email to: ${to}`);
        
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken.token,
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email successfully sent to ${to}: ${info.response}`);
    } catch (error) {
        console.error(`❌ Error sending email to ${to}:`, error.message);
    }
};

// Test email sending manually
if (require.main === module) {
    sendEmail('your-email@gmail.com', 'Test Email', 'This is a test email from Warranty Tracker.');
}

module.exports = sendEmail;
