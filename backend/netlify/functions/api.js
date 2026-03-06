const serverless = require('serverless-http');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('../../config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));

// Route files
const authRoutes = require('../../routes/authRoutes');
const triageRoutes = require('../../routes/triageRoutes');
const familyRoutes = require('../../routes/familyRoutes');
const officerRoutes = require('../../routes/officerRoutes');
const reportRoutes = require('../../routes/reportRoutes');
const pregnancyRoutes = require('../../routes/pregnancyRoutes');
const alertRoutes = require('../../routes/alertRoutes');
const reminderRoutes = require('../../routes/reminderRoutes');
const migrationRoutes = require('../../routes/migrationRoutes');
const recoveryRoutes = require('../../routes/recoveryRoutes');

// Mount routers - note: path is relative to the function URL
app.use('/auth', authRoutes);
app.use('/triage', triageRoutes);
app.use('/family', familyRoutes);
app.use('/officer', officerRoutes);
app.use('/reports', reportRoutes);
app.use('/pregnancy', pregnancyRoutes);
app.use('/alerts', alertRoutes);
app.use('/reminders', reminderRoutes);
app.use('/migration', migrationRoutes);
app.use('/recovery', recoveryRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Aayush Seva AI API is running...', status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
});

// Export handler for Netlify
module.exports.handler = serverless(app);
