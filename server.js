const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DB_FILE = 'accounts.json';

function loadDatabase() {
  if (fs.existsSync(DB_FILE)) {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  }
  return { accounts: [] };
}

function saveDatabase(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

let db = loadDatabase();

// Serve HTML directly
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// API endpoints
app.get('/api/accounts', (req, res) => {
  res.json({ accounts: db.accounts });
});

app.post('/api/accounts', (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) return res.status(400).json({ error: 'Required' });
  const newAccount = { id: Date.now(), phone, password };
  db.accounts.push(newAccount);
  saveDatabase(db);
  res.json(newAccount);
});

app.delete('/api/accounts/:id', (req, res) => {
  db.accounts = db.accounts.filter(a => a.id !== parseInt(req.params.id));
  saveDatabase(db);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server on ${PORT}`));
