import React, { useEffect, useState } from 'react';
import api from '../api';

function AddItemForm({ onAdded }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [desc, setDesc] = useState('');
  const [stock, setStock] = useState(10);
  const [loading, setLoading] = useState(false);

  async function submit(e){
    e.preventDefault();
    if(!name || !price) return alert('Name and price required');
    setLoading(true);
    try{
      await api.addItem({ name, price: Number(price), image, description: desc, stock: Number(stock) });
      setName(''); setPrice(''); setImage(''); setDesc(''); setStock(10);
      onAdded && onAdded();
    }catch(err){ alert(err.message) }
    finally{ setLoading(false) }
  }

  return (
    <form className="add-form" onSubmit={submit}>
      <input placeholder="Product name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Price (e.g. 99.50)" value={price} onChange={e=>setPrice(e.target.value)} />
      <input placeholder="Image URL (optional)" value={image} onChange={e=>setImage(e.target.value)} />
      <input placeholder="Short description" value={desc} onChange={e=>setDesc(e.target.value)} />
      <input type="number" min="0" value={stock} onChange={e=>setStock(e.target.value)} />
      <button disabled={loading}>{loading ? 'Adding...' : 'Add Product'}</button>
    </form>
  )
}

function ProductCard({ item, onAdd, onDelete, onStartEdit }){
  const placeholder = 'https://via.placeholder.com/300x200?text=No+Image';
  return (
    <div className="card">
      <img src={item.image || placeholder} alt={item.name} />
      <div className="card-body">
        <h3>{item.name}</h3>
        <div className="desc">{item.description}</div>
        <div className="meta">
          <strong>₹{item.price.toFixed(2)}</strong>
          <span>Stock: {item.stock}</span>
        </div>
        <div className="card-actions">
          <button onClick={()=>onAdd(item)}>Add to Cart</button>
          <button className="muted" onClick={()=>onStartEdit(item)}>Edit</button>
          <button className="danger" onClick={()=>onDelete(item.id)}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function Home(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editing, setEditing] = useState(null);

  useEffect(()=>{ fetchItems() }, [refreshKey]);

  async function fetchItems(){
    setLoading(true); setError(null);
    try{
      const data = await api.getItems();
      setItems(data);
    }catch(err){ setError('Could not load items') }
    finally{ setLoading(false) }
  }

  async function addToCart(item){
    try{
      await api.addToCart({ itemId: item.id, qty: 1 });
      alert('Added to cart');
    }catch(err){ alert(err.message) }
  }

  async function handleDelete(id){
    if(!confirm('Delete product?')) return;
    try{
      await api.deleteItem(id);
      setRefreshKey(k=>k+1);
    }catch(err){ alert(err.message) }
  }

  function startEdit(item){
    setEditing(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleUpdate(e){
    e.preventDefault();
    if(!editing) return;
    try{
      await api.updateItem(editing.id, editing);
      setEditing(null);
      setRefreshKey(k=>k+1);
    }catch(err){ alert(err.message) }
  }

  return (
    <div className="home">
      <section className="left-col">
        <h2>Products</h2>
        {editing && (
          <form className="edit-form" onSubmit={handleUpdate}>
            <h4>Edit product</h4>
            <input value={editing.name} onChange={e=>setEditing({...editing, name:e.target.value})} />
            <input value={editing.price} onChange={e=>setEditing({...editing, price:e.target.value})} />
            <input value={editing.image} onChange={e=>setEditing({...editing, image:e.target.value})} />
            <input value={editing.description} onChange={e=>setEditing({...editing, description:e.target.value})} />
            <input type="number" value={editing.stock} onChange={e=>setEditing({...editing, stock:e.target.value})} />
            <div style={{display:'flex', gap:8}}>
              <button type="submit">Save</button>
              <button type="button" onClick={()=>setEditing(null)}>Cancel</button>
            </div>
          </form>
        )}
        {loading ? <p>Loading...</p> : error ? <p className="err">{error}</p> : (
          <div className="grid">
            {items.map(it=> <ProductCard key={it.id} item={it} onAdd={addToCart} onDelete={handleDelete} onStartEdit={startEdit} />)}
            {items.length === 0 && <div className="empty">No products yet. Add one!</div>}
          </div>
        )}
      </section>
      <aside className="right-col">
        <h3>Add new product</h3>
        <AddItemForm onAdded={()=>setRefreshKey(k=>k+1)} />
        <hr />
        <h3>Manage</h3>
        <p>Use Edit / Delete on product cards.</p>
      </aside>
    </div>
  )
}
