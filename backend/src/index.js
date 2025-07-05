const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const statusRoutes = require('./routes/status');
const subscribeRoutes = require('./routes/subscribe');
const monitorJob = require('./jobs/monitor');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/status', statusRoutes);
app.use('/subscribe', subscribeRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schedule monitoring job (every 5 minutes)
cron.schedule('*/5 * * * *', monitorJob);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 