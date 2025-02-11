require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const warrantyRoutes = require('./routes/warrantyRoutes');



const app = express();
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();
require('./scheduler'); // Load scheduled email reminders
app.use('/api/warranty', warrantyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/receipts', receiptRoutes);


app.get('/', (req, res) => {
    res.send('Digital Warranty Tracker API is Running!');
});

const PORT = process.env.PORT || 6001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
