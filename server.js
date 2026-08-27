const express = require('express');
const app = express();
app.use(express.json());

let accounts = [];

app.get('/', (req, res) => {
  const free = accounts.filter(a => a.status === 'free').length;
  const inuse = accounts.filter(a => a.status === 'inuse').length;
  const waiting = accounts.filter(a => a.status === 'waiting').length;
  const badpass = accounts.filter(a => a.status === 'badpass').length;

  res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Login Pool Manager</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#1a1a1a;color:#fff;font-family:Arial,sans-serif;padding:20px}h1{font-size:28px;display:flex;align-items:center;gap:10px;margin-bottom:30px}.badge{background:#4ade80;color:#000;padding:8px 16px;border-radius:20px;font-size:12px;margin-left:auto}.boxes{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin:30px 0}@media(max-width:600px){.boxes{grid-template-columns:1fr}}.box{border:2px solid;border-radius:16px;padding:25px;min-height:300px}.box-header{display:flex;align-items:center;gap:10px;margin-bottom:20px;padding-bottom:15px;border-bottom:2px solid;font-size:16px;font-weight:bold;text-transform:uppercase}.box-count{margin-left:auto;background:rgba(255,255,255,0.1);padding:4px 12px;border-radius:20px;font-size:12px}.box-free{border-color:#059669}.box-free .box-header{border-color:#059669;color:#4ade80}.box-inuse{border-color:#2563eb}.box-inuse .box-header{border-color:#2563eb;color:#60a5fa}.box-waiting{border-color:#7c3aed}.box-waiting .box-header{border-color:#7c3aed;color:#c4b5fd}.box-badpass{border-color:#8b4513}.box-badpass .box-header{border-color:#8b4513;color:#ff9966}.btn-view{width:100%;padding:12px;background:#b8860b;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:bold;margin-top:20px}.add-section{background:#2a2a2a;border:2px dashed #444;border-radius:16px;padding:20px;margin:30px 0}input{width:100%;padding:12px;margin:10px 0;background:#1a1a1a;border:1px solid #444;color:#fff;border-radius:8px;font-size:14px}.btn-add{width:100%;padding:10px;background:#059669;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:bold}.actions{display:grid;grid-template-columns:1fr 1fr;gap:15px;margin:30px 0}.btn-action{padding:15px;background:#1e3a8a;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:bold;font-size:16px}.btn-deposit{background:#dc2626}.timestamp{text-align:center;color:#666;font-size:12px;margin-top:20px}</style></head><body><h1>🔒 Login pool manager<span class="badge">🟢 Live</span></h1><div class="boxes"><div class="box box-free"><div class="box-header">✅ FREE<span class="box-count">${free}</span></div><div>Accounts ready</div><button class="btn-view">View ${free}</button></div><div class="box box-inuse"><div class="box-header">▶ IN USE<span class="box-count">${inuse}</span></div><div>Not yet logged out</div><button class="btn-view">View ${inuse}</button></div><div class="box box-waiting"><div class="box-header">⏳ WAITING 24H<span class="box-count">${waiting}</span></div><div>Full account</div><button class="btn-view">View ${waiting}</button></div><div class="box box-badpass"><div class="box-header">❌ BAD PASSWORD<span class="box-count">${badpass}</span></div><div>Login failed</div><button class="btn-view">View ${badpass}</button></div></div><div class="add-section"><h3>➕ ADD ACCOUNT</h3><input type="text" id="phone" placeholder="Phone number"><input type="password" id="password" placeholder="Password"><button class="btn-add" onclick="addAccount()">Add</button></div><div class="actions"><button class="btn-action" onclick="viewIds()">👁️ View IDs & Numbers</button><button class="btn-action btn-deposit" onclick="deposit()">💳 Deposit / Clear</button></div><div class="timestamp">22:29:20 CAT - Live data - Postgres - Zambia Time</div></body><script>async function addAccount(){const phone=document.getElementById('phone').value;const password=document.getElementById('password').value;if(!phone||!password){alert('Enter phone and password');return;}await fetch('/api/accounts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone,password,status:'free'})});document.getElementById('phone').value='';document.getElementById('password').value='';location.reload();}function viewIds(){alert('View IDs & Numbers - Coming soon');}function deposit(){alert('Deposit / Clear - Coming soon');}</script></html>`);
});

app.get('/api/accounts', (req, res) => {
  res.json({ accounts });
});

app.post('/api/accounts', (req, res) => {
  accounts.push({ id: Date.now(), phone: req.body.phone, password: req.body.password, status: req.body.status || 'free' });
  res.json({ ok: true });
});

app.put('/api/accounts/:id', (req, res) => {
  const acc = accounts.find(a => a.id == req.params.id);
  if (acc) acc.status = req.body.status;
  res.json({ ok: true });
});

app.delete('/api/accounts/:id', (req, res) => {
  accounts = accounts.filter(a => a.id != req.params.id);
  res.json({ ok: true });
});

app.listen(3000, () => console.log('OK'));
