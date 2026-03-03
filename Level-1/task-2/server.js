// Task 2: Simple REST API — Node.js + Express
// Codveda Full-Stack Development | Level 1

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// =============================================
// In-memory database (massiv)
// =============================================
let users = [
  { id: 1, name: "Ali Karimov",     email: "ali@example.com",    age: 25 },
  { id: 2, name: "Malika Yusupova", email: "malika@example.com", age: 22 },
  { id: 3, name: "Jasur Toshmatov", email: "jasur@example.com",  age: 28 }
];
let nextId = 4;

// =============================================
// GET /api/users — barcha foydalanuvchilar
// =============================================
app.get('/api/users', (req, res) => {
  res.status(200).json({ success: true, count: users.length, data: users });
});

// =============================================
// GET /api/users/:id — bitta foydalanuvchi
// =============================================
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });
  res.status(200).json({ success: true, data: user });
});

// =============================================
// POST /api/users — yangi foydalanuvchi
// =============================================
app.post('/api/users', (req, res) => {
  const { name, email, age } = req.body;
  if (!name || !email)
    return res.status(400).json({ success: false, message: 'Ism va email majburiy' });
  if (users.find(u => u.email === email))
    return res.status(409).json({ success: false, message: 'Bu email allaqachon mavjud' });

  const newUser = { id: nextId++, name, email, age: age || null };
  users.push(newUser);
  res.status(201).json({ success: true, message: 'Foydalanuvchi yaratildi', data: newUser });
});

// =============================================
// PUT /api/users/:id — yangilash
// =============================================
app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });

  const { name, email, age } = req.body;
  if (name)  user.name  = name;
  if (email) user.email = email;
  if (age)   user.age   = age;

  res.status(200).json({ success: true, message: 'Yangilandi', data: user });
});

// =============================================
// DELETE /api/users/:id — o'chirish
// =============================================
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: 'Foydalanuvchi topilmadi' });

  const deleted = users.splice(index, 1)[0];
  res.status(200).json({ success: true, message: "O'chirildi", data: deleted });
});

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Endpoint topilmadi' }));

// Server
app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
  console.log('Endpoints: GET/POST/PUT/DELETE /api/users');
});
