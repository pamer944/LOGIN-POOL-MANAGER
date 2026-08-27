const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database file
const DB_FILE = 'accounts.json';

// Load database
function loadDatabase() {
  if (fs.existsSync(DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch {
      return { accounts: [] };
    }
  }
  return { accounts: [] };
}

// Save database
function saveDatabase(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

let db = loadDatabase();

// Serve index.html on root
app.get('/', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'index.html'));
  } catch (err) {
    res.status(500).send('Error loading page');
  }
});

// API: Get all accounts
app.get('/api/accounts', (req, res) => {
  res.json({ accounts: db.accounts });
});

// API: Add new account
app.post('/api/accounts', (req, res) => {
  try {
    const { phone, password } = req.body;
    
    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone and password required' });
    }

    const newAccount = {
      id: Date.now(),
      phone: phone,
      password: password,
      createdAt: new Date()
    };

    db.accounts.push(newAccount);
    saveDatabase(db);
    res.json(newAccount);
  } catch (err) {
    res.status(500).json({ error: 'Error adding account' });
  }
});

// API: Delete account
app.delete('/api/accounts/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    db.accounts = db.accounts.filter(a => a.id !== id);
    saveDatabase(db);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting account' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'online' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
