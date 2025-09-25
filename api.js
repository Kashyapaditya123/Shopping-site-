const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function req(path, opts={}){
  const res = await fetch(API_BASE + path, { headers: { 'Content-Type': 'application/json' }, ...opts });
  if (!res.ok) {
    const err = await res.json().catch(()=>({error:res.statusText}));
    throw new Error(err.error || res.statusText);
  }
  return res.json().catch(()=>null);
}

export default {
  getItems: () => req('/items'),
  addItem: (body) => req('/items', { method: 'POST', body: JSON.stringify(body) }),
  updateItem: (id, body) => req(`/items/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteItem: (id) => req(`/items/${id}`, { method: 'DELETE' }),
  getCart: () => req('/cart'),
  addToCart: (body) => req('/cart', { method: 'POST', body: JSON.stringify(body) }),
  updateCartItem: (id, body) => req(`/cart/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  removeFromCart: (id) => req(`/cart/${id}`, { method: 'DELETE' }),
}
