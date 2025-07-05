# Environment Variables Setup Guide

This guide will help you set up the environment variables for both the backend and frontend applications.

## Backend Setup

1. Navigate to the `backend` directory
2. Copy the example file: `cp env.example .env`
3. Edit the `.env` file with your actual values:

### Required Variables

- **PORT**: Server port (default: 5000)
- **MONGODB_URI**: MongoDB connection string
- **EMAIL_USER**: Gmail address for sending notifications
- **EMAIL_PASS**: Gmail app password (not your regular password)
- **TARGET_URL**: URL to monitor (default: https://results.bmsce.in/)

### Optional Variables

- **JWT_SECRET**: Secret key for JWT tokens (if adding authentication)
- **RATE_LIMIT_WINDOW_MS**: Rate limiting window in milliseconds
- **RATE_LIMIT_MAX_REQUESTS**: Maximum requests per window

### Gmail App Password Setup

To use Gmail for sending emails:

1. Enable 2-factor authentication on your Google account
2. Go to Google Account settings → Security → App passwords
3. Generate an app password for "Mail"
4. Use this password in `EMAIL_PASS` (not your regular Gmail password)

## Frontend Setup

1. Navigate to the `frontend` directory
2. Copy the example file: `cp env.example .env`
3. Edit the `.env` file with your actual values:

### Required Variables

- **REACT_APP_API_URL**: Backend API URL (default: http://localhost:5000)

### Optional Variables

- **REACT_APP_GA_TRACKING_ID**: Google Analytics tracking ID
- **REACT_APP_SENTRY_DSN**: Sentry error tracking DSN
- **REACT_APP_ENABLE_DARK_MODE**: Enable dark mode feature
- **REACT_APP_ENABLE_NOTIFICATIONS**: Enable browser notifications

## Example .env Files

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ur-monitor
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
TARGET_URL=https://results.bmsce.in/
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GA_TRACKING_ID=your-ga-tracking-id
REACT_APP_SENTRY_DSN=your-sentry-dsn
REACT_APP_ENABLE_DARK_MODE=true
REACT_APP_ENABLE_NOTIFICATIONS=true
```

## Security Notes

1. **Never commit .env files** to version control
2. Use strong, unique passwords for production
3. Regularly rotate sensitive credentials
4. Use environment-specific configurations for different deployment environments

## Production Deployment

For production deployment:

1. Use a proper MongoDB instance (MongoDB Atlas, etc.)
2. Use a dedicated email service (SendGrid, Mailgun, etc.)
3. Set `NODE_ENV=production`
4. Use HTTPS URLs
5. Implement proper rate limiting and security measures

## Troubleshooting

- **Email not sending**: Check Gmail app password and 2FA settings
- **MongoDB connection failed**: Verify connection string and network access
- **Frontend can't connect to backend**: Check CORS settings and API URL
- **Environment variables not loading**: Ensure .env files are in the correct directories 