const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory stores
let items = []; // { id, name, price, image, description, stock }
let cart = [];  // { id, itemId, qty }

// Helper to compute cart with item details
function getCartDetailed() {
  return cart.map(c => {
    const item = items.find(i => i.id === c.itemId);
    return { id: c.id, itemId: c.itemId, qty: c.qty, item };
  });
}

// Seed with a few items (so app isn't empty)
function seed() {
  if (items.length) return;
  items.push(
    { id: uuidv4(), name: 'Fresh Milk', price: 39.0, image: '', description: '1L full cream milk', stock: 10 },
    { id: uuidv4(), name: 'Brown Bread', price: 29.0, image: '', description: 'Whole wheat bread', stock: 20 },
    { id: uuidv4(), name: 'Eggs (12)', price: 99.0, image: '', description: 'Free-range eggs dozen', stock: 30 }
  );
}

seed();

// Items endpoints
app.get('/api/items', (req, res) => {
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const { name, price, image, description, stock } = req.body;
  if (!name || price == null) return res.status(400).json({ error: 'name and price required' });
  const item = { id: uuidv4(), name, price: Number(price), image: image || '', description: description || '', stock: Number(stock) || 0 };
  items.push(item);
  res.status(201).json(item);
});

app.put('/api/items/:id', (req, res) => {
  const id = req.params.id;
  const { name, price, image, description, stock } = req.body;
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: 'item not found' });
  items[idx] = {
    ...items[idx],
    name: name !== undefined ? name : items[idx].name,
    price: price !== undefined ? Number(price) : items[idx].price,
    image: image !== undefined ? image : items[idx].image,
    description: description !== undefined ? description : items[idx].description,
    stock: stock !== undefined ? Number(stock) : items[idx].stock,
  };
  res.json(items[idx]);
});

app.delete('/api/items/:id', (req, res) => {
  const id = req.params.id;
  const before = items.length;
  items = items.filter(i => i.id !== id);
  if (items.length === before) return res.status(404).json({ error: 'not found' });
  // also remove from cart
  cart = cart.filter(c => c.itemId !== id);
  res.json({ success: true });
});

// Cart endpoints
app.get('/api/cart', (req, res) => {
  res.json(getCartDetailed());
});

app.post('/api/cart', (req, res) => {
  const { itemId, qty } = req.body;
  if (!itemId) return res.status(400).json({ error: 'itemId required' });
  const item = items.find(i => i.id === itemId);
  if (!item) return res.status(404).json({ error: 'item not found' });
  const q = Number(qty) || 1;
  // If already in cart, set qty += q
  const existing = cart.find(c => c.itemId === itemId);
  if (existing) {
    existing.qty += q;
  } else {
    cart.push({ id: uuidv4(), itemId, qty: q });
  }
  res.status(201).json(getCartDetailed());
});

app.put('/api/cart/:id', (req, res) => {
  const id = req.params.id;
  const { qty } = req.body;
  const idx = cart.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'cart item not found' });
  const newQty = Number(qty);
  if (newQty <= 0) {
    // remove item
    cart.splice(idx, 1);
  } else {
    cart[idx].qty = newQty;
  }
  res.json(getCartDetailed());
});

app.delete('/api/cart/:id', (req, res) => {
  const id = req.params.id;
  const before = cart.length;
  cart = cart.filter(c => c.id !== id);
  if (cart.length === before) return res.status(404).json({ error: 'not found' });
  res.json(getCartDetailed());
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
