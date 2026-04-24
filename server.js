import "dotenv/config";
import express from "express";
import mysql from "mysql2";
import cors from "cors";

console.log("🔥 NEW CODE IS RUNNING");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Use ENV variables (important)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT)
});

db.connect((err) => {
  if (err) {
    console.log("❌ DB Error:", err.message);
  } else {
    console.log("✅ MySQL Connected");
  }
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// ✅ USERS route (FIXED — now uses MySQL)
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


// ✅ Test route 
app.get("/test", (req, res) => {
  res.send("TEST OK");
});

// ✅ PRODUCTS routes
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.post("/products", (req, res) => {
  const { name, price } = req.body;

  db.query(
    "INSERT INTO products (name, price) VALUES (?, ?)",
    [name, price],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Product added");
    }
  );
});

app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  db.query(
    "UPDATE products SET name=?, price=? WHERE id=?",
    [name, price, id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Product updated");
    }
  );
});

app.delete("/products/:id", (req, res) => {
  db.query(
    "DELETE FROM products WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Deleted");
    }
  );
});

// ✅ Start server ONCE
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});