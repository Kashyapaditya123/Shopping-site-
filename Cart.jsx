import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Cart(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ fetchCart() }, []);

  async function fetchCart(){
    setLoading(true);
    try{
      const data = await api.getCart();
      setItems(data);
    }catch(err){ alert(err.message) }
    finally{ setLoading(false) }
  }

  async function remove(id){
    if(!confirm('Remove from cart?')) return;
    try{
      await api.removeFromCart(id);
      fetchCart();
    }catch(err){ alert(err.message) }
  }

  async function changeQty(row, delta){
    try{
      const newQty = row.qty + delta;
      if(newQty <= 0){
        if(!confirm('Quantity is 0 — remove item?')) return;
        await api.removeFromCart(row.id);
      } else {
        await api.updateCartItem(row.id, { qty: newQty });
      }
      fetchCart();
    }catch(err){ alert(err.message) }
  }

  const total = items.reduce((s,c)=> s + (c.item ? c.item.price * c.qty : 0), 0);

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {loading ? <p>Loading...</p> : items.length===0 ? <p className="empty">Cart is empty</p> : (
        <div className="cart-list">
          {items.map(row => (
            <div className="cart-row" key={row.id}>
              <div className="left">
                <img src={(row.item && row.item.image) || 'https://via.placeholder.com/120x80?text=No+Image'} alt="" />
                <div>
                  <strong>{row.item?.name || 'Item missing'}</strong>
                  <div className="meta">Qty: {row.qty} · ₹{row.item ? (row.item.price * row.qty).toFixed(2) : '0.00'}</div>
                </div>
              </div>
              <div className="actions">
                <div style={{display:'flex', gap:8}}>
                  <button onClick={()=>changeQty(row, -1)}>-</button>
                  <button onClick={()=>changeQty(row, +1)}>+</button>
                  <button className="danger" onClick={()=>remove(row.id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
          <div className="cart-total">Total: <strong>₹{total.toFixed(2)}</strong></div>
        </div>
      )}
    </div>
  )
}
