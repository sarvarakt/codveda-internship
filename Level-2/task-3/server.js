require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const app  = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/codveda_db')
  .then(() => console.log('MongoDB ga ulandi!'))
  .catch(err => console.log('MongoDB xatosi:', err.message));

// User Schema
const userSchema = new mongoose.Schema({
  name:  { type: String, required: [true, 'Ism majburiy'], trim: true, minlength: 2 },
  email: { type: String, required: [true, 'Email majburiy'], unique: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Email formati notogri'] },
  age:   { type: Number, min: 1, max: 120 },
  role:  { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });
userSchema.index({ email: 1 });
const User = mongoose.model('User', userSchema);

// Product Schema (User bilan aloqa)
const productSchema = new mongoose.Schema({
  name:      { type: String, required: [true, 'Mahsulot nomi majburiy'], trim: true },
  price:     { type: Number, required: [true, 'Narx majburiy'], min: 0 },
  category:  { type: String, required: true },
  stock:     { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
productSchema.index({ name: 1, category: 1 });
const Product = mongoose.model('Product', productSchema);

// USER CRUD
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-__v').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');
    if (!user) return res.status(404).json({ success: false, message: 'Topilmadi' });
    res.json({ success: true, data: user });
  } catch { res.status(400).json({ success: false, message: 'Notogri ID' }); }
});

app.post('/api/users', async (req, res) => {
  try {
    const saved = await new User(req.body).save();
    res.status(201).json({ success: true, message: 'Yaratildi', data: saved });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ success: false, message: 'Email allaqachon mavjud' });
    res.status(400).json({ success: false, message: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'Topilmadi' });
    res.json({ success: true, message: 'Yangilandi', data: user });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Topilmadi' });
    res.json({ success: true, message: 'Ochirildi', data: user });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

// PRODUCT CRUD
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post('/api/products', async (req, res) => {
  try {
    const saved = await new Product(req.body).save();
    res.status(201).json({ success: true, message: 'Mahsulot yaratildi', data: saved });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Topilmadi' });
    res.json({ success: true, message: 'Yangilandi', data: product });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Topilmadi' });
    res.json({ success: true, message: 'Ochirildi' });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

app.use((req, res) => res.status(404).json({ success: false, message: 'Endpoint topilmadi' }));

app.listen(PORT, () => {
  console.log('Server: http://localhost:' + PORT);
  console.log('Users:    /api/users');
  console.log('Products: /api/products');
});
