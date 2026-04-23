const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'nikita#2007',
  database: 'bakery_db'
})

db.connect(err => {
  if (err) console.log(err)
  else console.log('MySQL Connected')
})

app.get('/', (req, res) => {
  res.send('Backend running')
})

app.listen(5000, () => {
  console.log('Server running on port 5000')
})


app.post('/products', (req, res) => {
  const { name, price } = req.body

  db.query(
    'INSERT INTO products (name, price) VALUES (?, ?)',
    [name, price],
    (err) => {
      if (err) return res.send(err)
      res.send('Product added')
    }
  )
})


app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  const sql = "UPDATE products SET name=?, price=? WHERE id=?";
  db.query(sql, [name, price, id], (err, result) => {
    if (err) return res.json(err);

    res.json({
      message: "Product updated"
    });
  });
});


const connection = mysql.createConnection({
  host: 'localhost', // or use the actual host if it's a remote DB
  user: 'root', // replace with your MySQL username
  password: 'your_password', // replace with your MySQL password
  database: 'myapp_db' // replace with your database name
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL!');
  }
});

module.exports = connection;


app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.send(err)
    res.json(results)
  })
})


app.delete('/products/:id', (req, res) => {
  db.query(
    'DELETE FROM products WHERE id=?',
    [req.params.id],
    (err) => {
      if (err) return res.send(err)
      res.send('Deleted')
    }
  )
})