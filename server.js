const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());
app.use(express.static(__dirname)); // serves index.html, expenses.html, style.css, app.js...

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',            // XAMPP default
  database: 'expense_db',
  dateStrings: true        // return dates as 'YYYY-MM-DD' strings
});

const toExpense = (r) => ({ ...r, amount: Number(r.amount) });

app.get('/api/expenses', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM expenses ORDER BY date DESC, id DESC');
    res.json(rows.map(toExpense));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/expenses/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM expenses WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(toExpense(rows[0]));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/expenses', async (req, res) => {
  try {
    const { date, description, category, amount } = req.body;
    const [result] = await db.query(
      'INSERT INTO expenses (date, description, category, amount) VALUES (?, ?, ?, ?)',
      [date, description, category, amount]
    );
    res.json({ id: result.insertId });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/expenses/:id', async (req, res) => {
  try {
    const { date, description, category, amount } = req.body;
    await db.query(
      'UPDATE expenses SET date = ?, description = ?, category = ?, amount = ? WHERE id = ?',
      [date, description, category, amount, req.params.id]
    );
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/expenses/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM expenses WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(3000, () => console.log('Running at http://localhost:3000'));