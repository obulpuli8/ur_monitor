const express = require('express');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const router = express.Router();

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/', async (req, res) => {
  try {
    const { email, days } = req.body;
    
    if (!email || !days) {
      return res.status(400).json({ message: 'Email and days are required' });
    }

    const monitorUntil = new Date();
    monitorUntil.setDate(monitorUntil.getDate() + days);

    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      user.monitorDays = days;
      user.monitorUntil = monitorUntil;
      user.isActive = true;
      await user.save();
    } else {
      user = new User({
        email,
        monitorDays: days,
        monitorUntil
      });
      await user.save();
    }

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'UR Monitor - Subscription Confirmed',
      html: `
        <h2>Welcome to UR Monitor!</h2>
        <p>Your subscription has been confirmed. You will receive notifications when BMSCE results are updated.</p>
        <p><strong>Monitoring Duration:</strong> ${days} days</p>
        <p><strong>Monitoring Until:</strong> ${monitorUntil.toLocaleDateString()}</p>
        <br>
        <p>Best regards,<br>UR Monitor Team</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      message: 'Subscription successful! Check your email for confirmation.',
      monitorUntil: monitorUntil
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ message: 'Subscription failed' });
  }
});

module.exports = router; 