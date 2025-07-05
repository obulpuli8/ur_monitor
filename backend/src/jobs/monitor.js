const axios = require('axios');
const crypto = require('crypto');
const Snapshot = require('../models/Snapshot');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function monitorJob() {
  try {
    console.log('Running monitoring job...');
    
    // Fetch target website
    const response = await axios.get(process.env.TARGET_URL, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const content = response.data;
    const hash = crypto.createHash('md5').update(content).digest('hex');

    // Get latest snapshot
    const latestSnapshot = await Snapshot.findOne().sort({ timestamp: -1 });
    
    let changed = false;
    if (latestSnapshot && latestSnapshot.hash !== hash) {
      changed = true;
      console.log('Change detected! Sending notifications...');
      
      // Send notifications to active users
      const activeUsers = await User.find({ 
        isActive: true, 
        monitorUntil: { $gt: new Date() } 
      });

      for (const user of activeUsers) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'UR Monitor - Results Updated!',
          html: `
            <h2>BMSCE Results Updated!</h2>
            <p>Your results have been updated on the BMSCE website.</p>
            <p><a href="${process.env.TARGET_URL}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Check Results Now</a></p>
            <br>
            <p>Best regards,<br>UR Monitor Team</p>
          `
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Notification sent to ${user.email}`);
        } catch (emailError) {
          console.error(`Failed to send email to ${user.email}:`, emailError);
        }
      }
    }

    // Save new snapshot
    const snapshot = new Snapshot({
      content,
      hash,
      changed
    });
    await snapshot.save();

    // Clean up expired users
    await User.updateMany(
      { monitorUntil: { $lt: new Date() } },
      { isActive: false }
    );

    console.log('Monitoring job completed');
  } catch (error) {
    console.error('Monitoring job error:', error);
  }
}

module.exports = monitorJob;
