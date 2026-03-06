const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Simple CORS - allow all origins
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB connection
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Error:', err.message);
    }
};

// Connect before handling requests
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

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

// Mount routers at /api/* paths (Netlify redirects /api/* to this function)
app.use('/api/auth', authRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/officer', officerRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/pregnancy', pregnancyRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/migration', migrationRoutes);
app.use('/api/recovery', recoveryRoutes);

// Also mount at root paths for backward compatibility
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

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Aayush Seva AI API is running...', status: 'ok' });
});

app.get('/api', (req, res) => {
    res.json({ message: 'Aayush Seva AI API is running...', status: 'ok' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
});

module.exports.handler = serverless(app);
