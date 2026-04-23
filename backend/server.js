const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// SINGLE DB CONNECTION ONLY
const db = mysql.createConnection({
  host: 'hopper.proxy.rlwy.net',
  user: 'root',
  password: 'lKEOjHtGUlcjMFcpHfuwDLUAeoVOWZbI',
  database: 'railway',
  port: 18819
});

db.connect((err) => {
  if (err) {
    console.log("❌ DB Error:", err.message);
  } else {
    console.log("✅ MySQL Connected");
  }
});

// Routes
app.get('/', (req, res) => {
  res.send('Backend running');
});

app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post('/products', (req, res) => {
  const { name, price } = req.body;

  db.query(
    'INSERT INTO products (name, price) VALUES (?, ?)',
    [name, price],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send('Product added');
    }
  );
});

app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  db.query(
    'UPDATE products SET name=?, price=? WHERE id=?',
    [name, price, id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send('Product updated');
    }
  );
});

app.delete('/products/:id', (req, res) => {
  db.query(
    'DELETE FROM products WHERE id=?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send('Deleted');
    }
  );
});

// START SERVER AT END
app.listen(5000, () => {
  console.log('Server running on port 5000');
});