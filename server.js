const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login Pool Manager</title>
      <style>
        body { background: #1a1a1a; color: #fff; font-family: Arial; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; }
        h1 { text-align: center; }
        input { width: 100%; padding: 10px; margin: 10px 0; background: #333; border: 1px solid #555; color: #fff; border-radius: 5px; }
        button { width: 100%; padding: 10px; background: #059669; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
        button:hover { background: #047857; }
        .account { background: #333; padding: 15px; margin: 10px 0; border-radius: 5px; display: flex; justify-content: space-between; }
        .delete-btn { background: #dc2626; padding: 8px 15px; width: auto; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🔒 Login Pool Manager</h1>
        <input type="text" id="phone" placeholder="Phone number">
        <input type="password" id="password" placeholder="Password">
        <button onclick="addAccount()">Add Account</button>
        <div id="accounts"></div>
      </div>
      <script>
        async function load() {
          const res = await fetch('/api/accounts');
          const data = await res.json();
          const div = document.getElementById('accounts');
          if (data.accounts.length === 0) {
            div.innerHTML = '<p style="text-align:center;color:#666;">No accounts</p>';
            return;
          }
          div.innerHTML = data.accounts.map(a => '<div class="account"><div><strong>' + a.phone + '</strong><br><small>🔑 ' + a.password + '</small></div><button class="delete-btn" onclick="del(' + a.id + ')">Delete</button></div>').join('');
        }
        async function addAccount() {
          const phone = document.getElementById('phone').value;
          const password = document.getElementById('password').value;
          if (!phone || !password) { alert('Enter phone and password'); return; }
          await fetch('/api/accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, password })
          });
          document.getElementById('phone').value = '';
          document.getElementById('password').value = '';
          load();
        }
        async function del(id) {
          if (!confirm('Delete?')) return;
          await fetch('/api/accounts/' + id, { method: 'DELETE' });
          load();
        }
        load();
        setInterval(load, 2000);
      </script>
    </body>
    </html>
  `);
});

app.get('/api/accounts', (req, res) => {
  res.json({ accounts: global.accounts || [] });
});

app.post('/api/accounts', (req, res) => {
  if (!global.accounts) global.accounts = [];
  const { phone, password } = req.body;
  if (!phone || !password) return res.status(400).json({ error: 'Required' });
  global.accounts.push({ id: Date.now(), phone, password });
  res.json({ id: global.accounts.length });
});

app.delete('/api/accounts/:id', (req, res) => {
  if (!global.accounts) global.accounts = [];
  global.accounts = global.accounts.filter(a => a.id !== parseInt(req.params.id));
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
  global.accounts = [];
});
