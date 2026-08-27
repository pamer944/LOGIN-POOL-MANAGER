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

// Serve dashboard HTML
app.get('/', (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Pool Manager</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #1a1a1a; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; min-height: 100vh; }
    .container { max-width: 1400px; margin: 0 auto; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #333; }
    h1 { font-size: 28px; display: flex; align-items: center; gap: 10px; }
    .status-badge { background: #8b3a3a; color: #fff; padding: 8px 16px; border-radius: 20px; font-size: 12px; }
    .workflow-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .box { background: #2a2a2a; border: 2px solid; border-radius: 16px; padding: 20px; min-height: 500px; display: flex; flex-direction: column; }
    .box-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid; font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
    .box-count { margin-left: auto; background: rgba(255,255,255,0.1); padding: 4px 12px; border-radius: 20px; font-size: 12px; }
    .box-main { border-color: #059669; }
    .box-main .box-header { border-color: #059669; color: #4ade80; }
    .box-login { border-color: #2563eb; }
    .box-login .box-header { border-color: #2563eb; color: #60a5fa; }
    .box-waiting { border-color: #7c3aed; }
    .box-waiting .box-header { border-color: #7c3aed; color: #c4b5fd; }
    .accounts-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; }
    .account-item { background: #1a1a1a; padding: 15px; border-radius: 10px; border-left: 4px solid; transition: all 0.3s; }
    .box-main .account-item { border-left-color: #059669; }
    .box-login .account-item { border-left-color: #2563eb; }
    .box-waiting .account-item { border-left-color: #7c3aed; }
    .phone-number { font-size: 16px; font-weight: bold; font-family: 'Courier New', monospace; margin-bottom: 5px; }
    .password { font-size: 12px; color: #888; font-family: 'Courier New', monospace; margin-bottom: 8px; }
    .timer { font-size: 12px; color: #fbbf24; margin-bottom: 8px; font-weight: bold; }
    .action-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
    .btn { padding: 8px 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s; flex: 1; min-width: 70px; }
    .btn-use { background: #059669; color: #fff; }
    .btn-use:hover { background: #047857; }
    .btn-logout { background: #dc2626; color: #fff; }
    .btn-logout:hover { background: #b91c1c; }
    .btn-delete { background: #444; color: #fff; }
    .btn-delete:hover { background: #555; }
    .empty-state { flex: 1; display: flex; align-items: center; justify-content: center; color: #666; text-align: center; padding: 40px 20px; }
    .add-account-section { background: #2a2a2a; border: 2px dashed #444; border-radius: 16px; padding: 20px; margin-bottom: 30px; }
    .add-account-title { display: flex; align-items: center; gap: 8px; font-size: 16px; margin-bottom: 15px; color: #999; text-transform: uppercase; letter-spacing: 1px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr auto; gap: 10px; margin-bottom: 15px; }
    input { background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 10px; border-radius: 8px; font-size: 14px; }
    input::placeholder { color: #666; }
    input:focus { outline: none; border-color: #059669; background: #252525; }
    .btn-add { background: #059669; color: #fff; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
    .btn-add:hover { background: #047857; }
    .timestamp { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
    @media (max-width: 768px) { .workflow-container { grid-template-columns: 1fr; } .action-buttons { flex-direction: column; } .btn { flex: auto; min-width: auto; } }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1><span style="font-size: 24px;">🔒</span> Login Pool Manager</h1>
      <div class="status-badge">🟢 Active</div>
    </header>

    <div class="add-account-section">
      <div class="add-account-title">➕ ADD NEW ACCOUNT</div>
      <div class="form-row">
        <input type="text" id="phone" placeholder="Phone number">
        <input type="password" id="password" placeholder="Password">
        <button class="btn-add" onclick="addAccount()">Add</button>
      </div>
    </div>

    <div class="workflow-container">
      <div class="box box-main">
        <div class="box-header"><span style="font-size: 20px;">📱</span> Main Box <span class="box-count" id="mainCount">0</span></div>
        <div class="accounts-list" id="mainList"><div class="empty-state">No accounts available</div></div>
      </div>
      <div class="box box-login">
        <div class="box-header"><span style="font-size: 20px;">🔐</span> In Use <span class="box-count" id="loginCount">0</span></div>
        <div class="accounts-list" id="loginList"><div class="empty-state">No active logins</div></div>
      </div>
      <div class="box box-waiting">
        <div class="box-header"><span style="font-size: 20px;">⏳</span> Waiting 24H <span class="box-count" id="waitingCount">0</span></div>
        <div class="accounts-list" id="waitingList"><div class="empty-state">No accounts waiting</div></div>
      </div>
    </div>

    <div class="timestamp" id="timestamp"></div>
  </div>

  <script>
    const API_BASE = '/api';

    async function loadAccounts() {
      try {
        const response = await fetch(API_BASE + '/accounts');
        const data = await response.json();
        const mainAccounts = data.accounts.filter(a => a.status === 'available');
        const loginAccounts = data.accounts.filter(a => a.status === 'in_use');
        const waitingAccounts = data.accounts.filter(a => a.status === 'waiting');
        renderAccounts(mainAccounts, 'main');
        renderAccounts(loginAccounts, 'login');
        renderAccounts(waitingAccounts, 'waiting');
        updateCounts(data.accounts);
        updateTimestamp();
      } catch (error) {
        console.error('Error loading accounts:', error);
      }
    }

    function updateCounts(accounts) {
      document.getElementById('mainCount').textContent = accounts.filter(a => a.status === 'available').length;
      document.getElementById('loginCount').textContent = accounts.filter(a => a.status === 'in_use').length;
      document.getElementById('waitingCount').textContent = accounts.filter(a => a.status === 'waiting').length;
    }

    function renderAccounts(accounts, boxType) {
      const listId = boxType === 'main' ? 'mainList' : boxType === 'login' ? 'loginList' : 'waitingList';
      const listElement = document.getElementById(listId);
      if (accounts.length === 0) {
        listElement.innerHTML = '<div class="empty-state">📭 No accounts</div>';
        return;
      }
      const html = accounts.map(account => {
        let timerHtml = '';
        let actionButton = '';
        if (account.status === 'available') {
          actionButton = \`<button class="btn btn-use" onclick="useAccount(\${account.id})">🔓 Use This</button>\`;
        } else if (account.status === 'in_use') {
          actionButton = \`<button class="btn btn-logout" onclick="logoutAccount(\${account.id})">📤 Log Out</button>\`;
        } else if (account.status === 'waiting') {
          const unlockTime = new Date(account.unlocksAt);
          const now = new Date();
          const timeLeft = unlockTime - now;
          if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / 3600000);
            const minutes = Math.floor((timeLeft % 3600000) / 60000);
            timerHtml = \`<div class="timer">⏱️ Ready in \${hours}h \${minutes}m</div>\`;
          }
          actionButton = \`<button class="btn btn-use" onclick="useAccount(\${account.id})">🔓 Use Now</button>\`;
        }
        return \`<div class="account-item"><div class="phone-number">\${account.phone}</div><div class="password">🔑 \${account.password}</div>\${timerHtml}<div class="action-buttons">\${actionButton}<button class="btn btn-delete" onclick="deleteAccount(\${account.id})">🗑️ Delete</button></div></div>\`;
      }).join('');
      listElement.innerHTML = html;
    }

    async function addAccount() {
      const phone = document.getElementById('phone').value;
      const password = document.getElementById('password').value;
      if (!phone || !password) { alert('Please enter phone and password'); return; }
      try {
        const response = await fetch(API_BASE + '/accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, password, status: 'available' })
        });
        if (response.ok) {
          document.getElementById('phone').value = '';
          document.getElementById('password').value = '';
          loadAccounts();
        }
      } catch (error) { alert('Error adding account'); }
    }

    async function useAccount(id) {
      try {
        const response = await fetch(API_BASE + '/accounts/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'in_use' })
        });
        if (response.ok) { loadAccounts(); alert('✅ Account moved to "In Use" box.'); }
      } catch (error) { alert('Error updating account'); }
    }

    async function logoutAccount(id) {
      try {
        const unlockTime = new Date();
        unlockTime.setHours(unlockTime.getHours() + 24);
        const response = await fetch(API_BASE + '/accounts/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'waiting', unlocksAt: unlockTime.toISOString() })
        });
        if (response.ok) { loadAccounts(); alert('✅ Account moved to "Waiting 24H" box.'); }
      } catch (error) { alert('Error updating account'); }
    }

    async function deleteAccount(id) {
      if (!confirm('Are you sure?')) return;
      try {
        const response = await fetch(API_BASE + '/accounts/' + id, { method: 'DELETE' });
        if (response.ok) { loadAccounts(); }
      } catch (error) { alert('Error deleting account'); }
    }

    function updateTimestamp() {
      const now = new Date();
      document.getElementById('timestamp').textContent = 'Last updated: ' + now.toLocaleTimeString();
    }

    setInterval(() => {
      fetch(API_BASE + '/accounts').then(r => r.json()).then(data => {
        data.accounts.forEach(account => {
          if (account.status === 'waiting' && account.unlocksAt) {
            const unlockTime = new Date(account.unlocksAt);
            const now = new Date();
            if (now >= unlockTime) {
              fetch(API_BASE + '/accounts/' + account.id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'available' })
              }).then(() => loadAccounts());
            }
          }
        });
      });
    }, 60000);

    loadAccounts();
    setInterval(loadAccounts, 5000);
  </script>
</body>
</html>`;
  res.send(html);
});

// API endpoints
app.get('/api/accounts', (req, res) => {
  res.json({ accounts: db.accounts });
});

app.post('/api/accounts', (req, res) => {
  const { phone, password, status } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ error: 'Phone and password required' });
  }
  const newAccount = {
    id: Date.now(),
    phone,
    password,
    status: status || 'available',
    createdAt: new Date(),
    lockedAt: null,
    unlocksAt: null
  };
  db.accounts.push(newAccount);
  saveDatabase(db);
  res.json(newAccount);
});

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

app.delete('/api/accounts/:id', (req, res) => {
  db.accounts = db.accounts.filter(a => a.id !== parseInt(req.params.id));
  saveDatabase(db);
  res.json({ success: true });
});

app.post('/api/accounts/clear/all', (req, res) => {
  db.accounts = [];
  saveDatabase(db);
  res.json({ success: true });
});

app.get('/health', (req, res) => {
  res.json({ status: 'online', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
