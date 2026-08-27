# 🔐 Login Pool Manager

A complete web application to track and manage multiple login accounts with status monitoring.

## Features
- 📊 Real-time dashboard with 4 status categories
- ➕ Add new accounts with phone and password
- 🔒 Track locked accounts
- ⏳ Monitor waiting accounts
- ⚠️ Flag failed password attempts
- 🌐 Works on any device (phone, tablet, desktop)

## Quick Start

### Local Testing (Before Deployment)
```bash
# Install dependencies
npm install

# Start server
npm start

# Open in browser
http://localhost:3000
```

### Deploy to Railway.app
1. Follow the **DEPLOYMENT_GUIDE.md** (5 minutes)
2. Your app will be live at: `https://your-project.railway.app`

## Tech Stack
- **Backend**: Node.js + Express
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Database**: JSON file (can upgrade to PostgreSQL)
- **Hosting**: Railway.app (FREE tier available)

## File Structure
```
├── server.js           - Backend server
├── package.json        - Dependencies
├── Procfile            - Railway deployment config
├── .gitignore          - Git configuration
└── public/
    └── index.html      - Dashboard UI
```

## API Endpoints
- `GET /api/accounts` - Get all accounts and counts
- `POST /api/accounts` - Add new account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account
- `POST /api/accounts/clear/all` - Clear all accounts

## Deployment Options

### 🆓 Free (Railway Free Tier)
- Works with 5 free services
- Service sleeps after 15 minutes of inactivity
- Data persists in JSON file
- No credit card required

### 💳 Paid ($5-12/month)
- Always running (no sleep)
- PostgreSQL database for permanent storage
- Custom domain
- Better performance

## Support
See **DEPLOYMENT_GUIDE.md** for detailed troubleshooting.
