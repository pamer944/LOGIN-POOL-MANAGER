const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database file
const DB_FILE = 'accounts.json';

// Load or create database
function loadDatabase() {
  if (fs.existsSync(DB_FILE)) {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  }
  return {
    accounts: []
  };
}

// Save database
function saveDatabase(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Initialize database
let db = loadDatabase();

// Routes

// Get all accounts with counts
app.get('/api/accounts', (req, res) => {
  const counts = {
    locked: db.accounts.filter(a => a.status === 'locked').length,
    inUse: db.accounts.filter(a => a.status === 'in_use').length,
    waiting: db.accounts.filter(a => a.status === 'waiting').length,
    badPassword: db.accounts.filter(a => a.status === 'bad_password').length,
    accounts: db.accounts
  };
  res.json(counts);
});

// Add new account
app.post('/api/accounts', (req, res) => {
  const { phone, password } = req.body;
  
  if (!phone || !password) {
    return res.status(400).json({ error: 'Phone and password required' });
  }

  const newAccount = {
    id: Date.now(),
    phone,
    password,
    status: 'waiting',
    createdAt: new Date(),
    lockedAt: null,
    unlocksAt: null
  };

  db.accounts.push(newAccount);
  saveDatabase(db);
  res.json(newAccount);
});

// Update account status
app.put('/api/accounts/:id', (req, res) => {
  const { status, lockedAt, unlocksAt } = req.body;
  const account = db.accounts.find(a => a.id === parseInt(req.params.id));

  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  account.status = status || account.status;
  if (lockedAt) account.lockedAt = lockedAt;
  if (unlocksAt) account.unlocksAt = unlocksAt;

  saveDatabase(db);
  res.json(account);
});

// Delete account
app.delete('/api/accounts/:id', (req, res) => {
  db.accounts = db.accounts.filter(a => a.id !== parseInt(req.params.id));
  saveDatabase(db);
  res.json({ success: true });
});

// Clear all accounts
app.post('/api/accounts/clear/all', (req, res) => {
  db.accounts = [];
  saveDatabase(db);
  res.json({ success: true });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'online', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
});
