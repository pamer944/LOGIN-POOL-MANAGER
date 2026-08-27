const express = require('express');
const app = express();

app.use(express.json());

let accounts = [];

app.get('/', (req, res) => {
  res.send('<html><body style="background:#1a1a1a;color:#fff;padding:20px;font-family:Arial"><h1>Login Pool Manager</h1><input id="p" placeholder="Phone"><input id="w" placeholder="Password"><button onclick="add()">Add</button><div id="l"></div><script>function add(){fetch("/api/accounts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({phone:document.getElementById("p").value,password:document.getElementById("w").value})}).then(()=>load());}function load(){fetch("/api/accounts").then(r=>r.json()).then(d=>{document.getElementById("l").innerHTML=d.accounts.map(a=>"<div style=\"background:#333;padding:10px;margin:10px 0\"><strong>"+a.phone+"</strong> | <button onclick=\"fetch(\'/api/accounts/"+a.id+"\',{method:\'DELETE\'}).then(()=>load())\">Delete</button></div>").join("");});}load();</script></body></html>');
});

app.get('/api/accounts', (req, res) => {
  res.json({ accounts });
});

app.post('/api/accounts', (req, res) => {
  accounts.push({ id: Date.now(), phone: req.body.phone, password: req.body.password });
  res.json({ ok: true });
});

app.delete('/api/accounts/:id', (req, res) => {
  accounts = accounts.filter(a => a.id != req.params.id);
  res.json({ ok: true });
});

app.listen(3000, () => console.log('OK'));
