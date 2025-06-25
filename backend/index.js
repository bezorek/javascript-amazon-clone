const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint: GET /products
app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM product");
    res.json(result.rows);
  } catch (err) {
    console.error("Błąd w /products:", err); // pełna treść błędu
    res.status(500).send("Błąd serwera");
  }
});

app.post("/order", async (req, res) => {
  try {
    const { order_id, totalValue, orderDate, items } = req.body;

    await pool.query(
      'INSERT INTO "order" (id, total_value, order_date) VALUES ($1, $2, $3)',
      [order_id, totalValue, orderDate || new Date()]
    );

    for (const item of items) {
      await pool.query(
        `INSERT INTO "orders_products" (order_id, product_id, quantity, delivery_date)
         VALUES ($1, $2, $3, $4)`,
        [order_id, item.product_id, item.quantity, item.delivery_date]
      );

      await pool.query(
        `UPDATE product
        SET quantity = quantity - $1
        WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    res.status(201).send("Order and items saved");
  } catch (err) {
    console.error("Błąd przy zapisie zamówienia:", err);
    res.status(500).send("Błąd serwera");
  }
});

app.get("/orders", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.id AS order_id,
        o.order_date,
        o.total_value,
        op.product_id,
        op.quantity,
        op.delivery_date,
        p.name,
        p.image,
        p.price
      FROM "order" o
      JOIN orders_products op ON o.id = op.order_id
      JOIN product p ON op.product_id = p.id
      ORDER BY o.order_date DESC
    `);

    // Grupuj zamówienia po order_id
    const ordersMap = {};

    for (const row of result.rows) {
      const {
        order_id,
        order_date,
        total_value,
        product_id,
        quantity,
        delivery_date,
        name,
        image,
        price
      } = row;

      if (!ordersMap[order_id]) {
        ordersMap[order_id] = {
          orderId: order_id,
          orderDate: order_date,
          totalValue: total_value,
          items: []
        };
      }

      ordersMap[order_id].items.push({
        productId: product_id,
        name,
        image,
        price,
        quantity,
        deliveryDate: delivery_date
      });
    }

    const orders = Object.values(ordersMap);
    res.json(orders);
  } catch (err) {
    console.error("Błąd przy pobieraniu zamówień:", err);
    res.status(500).send("Błąd serwera");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
