require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');

const app  = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

let users  = [];
let nextId = 1;

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Token topilmadi. Login qiling.' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { return res.status(403).json({ success: false, message: 'Token yaroqsiz.' }); }
}

function verifyAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, message: 'Faqat admin uchun.' });
  next();
}

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Ism, email va parol majburiy' });
    if (users.find(u => u.email === email)) return res.status(409).json({ success: false, message: 'Email allaqachon mavjud' });
    if (password.length < 6) return res.status(400).json({ success: false, message: 'Parol kamida 6 belgi' });
    const hashed = await bcrypt.hash(password, 10);
    const user = { id: nextId++, name, email, password: hashed, role: role === 'admin' ? 'admin' : 'user', createdAt: new Date().toISOString() };
    users.push(user);
    const { password: _, ...safe } = user;
    res.status(201).json({ success: true, message: 'Royxatdan otildi', data: safe });
  } catch { res.status(500).json({ success: false, message: 'Server xatosi' }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email va parol majburiy' });
    const user = users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ success: false, message: 'Email yoki parol notogri' });
    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ success: true, message: 'Kirdingiz', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch { res.status(500).json({ success: false, message: 'Server xatosi' }); }
});

app.get('/api/auth/me', verifyToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'Topilmadi' });
  const { password: _, ...safe } = user;
  res.status(200).json({ success: true, data: safe });
});

app.get('/api/users', verifyToken, verifyAdmin, (req, res) => {
  const safe = users.map(({ password: _, ...u }) => u);
  res.status(200).json({ success: true, count: safe.length, data: safe });
});

app.delete('/api/users/:id', verifyToken, verifyAdmin, (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'Topilmadi' });
  const { password: _, ...safe } = users.splice(index, 1)[0];
  res.status(200).json({ success: true, message: 'Ochirildi', data: safe });
});

app.use((req, res) => res.status(404).json({ success: false, message: 'Endpoint topilmadi' }));

app.listen(PORT, () => {
  console.log('Server: http://localhost:' + PORT);
  console.log('POST   /api/auth/register');
  console.log('POST   /api/auth/login');
  console.log('GET    /api/auth/me       <- token kerak');
  console.log('GET    /api/users         <- admin token kerak');
  console.log('DELETE /api/users/:id     <- admin token kerak');
});
