  Shopping App (React + Node.js)

Features:
- Full CRUD for products: Create, Read, Update, Delete
- Full Cart management: add, update quantity, remove
- Responsive Home page listing all products in a grid
- Inline edit form for products, delete button on cards
- Cart page with quantity + / - buttons and remove option

## Run locally

1. Backend
   ```bash
   cd backend
   npm install
   npm start
   ```
   API: http://localhost:5000/api

2. Frontend
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open Vite URL (usually http://localhost:5173).

Notes:
- Data is in-memory. Restarting the backend will reset products and cart.
- Image URL for products is optional; a placeholder is used when missing.
