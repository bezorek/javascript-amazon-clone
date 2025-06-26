const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Brak tokenu autoryzacyjnego" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Nieautoryzowany - nieprawidłowy token" });
  }
}

app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM product");
    res.json(result.rows);
  } catch (err) {
    console.error("Błąd w /products:", err); // pełna treść błędu
    res.status(500).send("Błąd serwera");
  }
});

app.post("/order", authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  try {
    const { order_id, totalValue, orderDate, items } = req.body;

    await pool.query(
      'INSERT INTO "order" (id, total_value, order_date, user_id) VALUES ($1, $2, $3, $4)',
      [order_id, totalValue, orderDate || new Date(), userId]
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

app.get("/orders", authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await pool.query(
      `
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
      WHERE o.user_id = $1
      ORDER BY o.order_date DESC
    `,
      [userId]
    );

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
        price,
      } = row;

      if (!ordersMap[order_id]) {
        ordersMap[order_id] = {
          orderId: order_id,
          orderDate: order_date,
          totalValue: total_value,
          items: [],
        };
      }

      ordersMap[order_id].items.push({
        productId: product_id,
        name,
        image,
        price,
        quantity,
        deliveryDate: delivery_date,
      });
    }

    const orders = Object.values(ordersMap);
    res.json(orders);
  } catch (err) {
    console.error("Błąd przy pobieraniu zamówień:", err);
    res.status(500).send("Błąd serwera");
  }
});

app.delete("/order/:id", async (req, res) => {
  const orderId = req.params.id;
  try {
    await pool.query("BEGIN");
    const checkResult = await pool.query(
      `SELECT * FROM orders_products
       WHERE order_id = $1 AND delivery_date <= CURRENT_DATE`,
      [orderId]
    );
    if (checkResult.rows.length > 0) {
      await pool.query("ROLLBACK");
      return res
        .status(400)
        .send("Nie można zwrócić zamówienia — produkty już dostarczone.");
    }

    const productsResult = await pool.query(
      `SELECT product_id, quantity FROM orders_products WHERE order_id = $1`,
      [orderId]
    );

    for (const item of productsResult.rows) {
      await pool.query(
        `UPDATE product
         SET quantity = quantity + $1
         WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    await pool.query('DELETE FROM "order" WHERE id = $1', [orderId]);
    await pool.query("COMMIT");

    res.status(200).send("Zamówienie usunięte");
  } catch (err) {
    console.error("Błąd przy usuwaniu zamówienia:", err);
    res.status(500).json({ message: "Błąd serwera przy usuwaniu zamówienia" });
  } finally {
    pool.release();
  }
});

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email i hasło są wymagane");
    }

    const userRes = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (userRes.rowCount !== 0) {
      return res.status(401).json({
        message: "Email jest już powiązany z zarejestrowanym użytkownikiem",
      });
    }

    const passwd = bcrypt.hashSync(password, 10);
    const uuid = crypto.randomUUID();
    await pool.query(
      "INSERT INTO users (id, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [uuid, email, passwd]
    );

    res.status(201).json({ message: "Użytkownik zarejestrowany pomyślnie" });
  } catch (err) {
    console.error("Wystąpił błąd podczas rejestracji:", err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email i hasło są wymagane" });
  }

  try {
    const userRes = await pool.query(
      "SELECT id, email, password_hash FROM users WHERE email = $1",
      [email]
    );
    if (userRes.rowCount === 0) {
      return res.status(401).json({ message: "Niepoprawne dane" });
    }
    const user = userRes.rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Niepoprawne dane" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Błąd logowania:", err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
