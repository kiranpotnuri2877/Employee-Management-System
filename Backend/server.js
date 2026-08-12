const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Database connection config using environment variables with fallbacks
const dbConfig = {
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root2',
  password: process.env.DB_PASSWORD || 'mysecret123',
  database: process.env.DB_NAME || 'employee_management',
};

let db;

// Function to handle connection and automatically retry if MySQL is still booting
function connectWithRetry() {
  db = mysql.createConnection(dbConfig);

  db.connect((err) => {
    if (err) {
      console.error('Failed to connect to DB on startup, retrying in 5 seconds...', err.message);
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log('Successfully connected to MySQL database.');
    }
  });

  db.on('error', (err) => {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      connectWithRetry();
    } else {
      throw err;
    }
  });
}

connectWithRetry();

// --- API Routes ---

// Get all employees
app.get('/employees', (req, res) => {
  const sql = 'SELECT * FROM employees';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

// Add new employee
app.post('/employees', (req, res) => {
  const { name, position } = req.body;
  const sql = 'INSERT INTO employees (name, position) VALUES (?, ?)';
  db.query(sql, [name, position], (err, result) => {
    if (err) {
      console.error('Error adding employee:', err);
      return res.status(500).json({ error: 'Failed to add employee' });
    }
    res.json({ id: result.insertId, name, position });
  });
});

// Update employee
app.put('/employees/:id', (req, res) => {
  const { name, position } = req.body;
  const { id } = req.params;
  const sql = 'UPDATE employees SET name=?, position=? WHERE id=?';
  db.query(sql, [name, position, id], (err) => {
    if (err) {
      console.error('Error updating employee:', err);
      return res.status(500).json({ error: 'Failed to update employee' });
    }
    res.json({ id, name, position });
  });
});

// Delete employee
app.delete('/employees/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM employees WHERE id=?';
  db.query(sql, [id], (err) => {
    if (err) {
      console.error('Error deleting employee:', err);
      return res.status(500).json({ error: 'Failed to delete employee' });
    }
    res.json({ id });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
