const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'db',
  user: 'root2',
  password: '**********',
  database: 'employee_management',
});


db.connect();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/employees', (req, res) => {
    const { name, position } = req.body;
    const sql = 'INSERT INTO employees (name, position) VALUES (?, ?)';
    db.query(sql, [name, position], (err, result) => {
      if (err) throw err;
      res.json({ id: result.insertId, name, position });
    });
  });

  app.get('/employees', (req, res) => {
    const sql = 'SELECT * FROM employees';
    db.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  });
app.put('/employees/:id', (req, res) => {
    const { name, position } = req.body;
    const { id } = req.params;
    const sql = 'UPDATE employees SET name=?, position=? WHERE id=?';
    db.query(sql, [name, position, id], (err) => {
      if (err) throw err;
      res.json({ id, name, position });
    });
  });

app.delete('/employees/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM employees WHERE id=?';
    db.query(sql, [id], (err) => {
      if (err) throw err;
      res.json({ id });
    });
  });
    
  
