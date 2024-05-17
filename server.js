const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
// var http = require('http');

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MySQL connection
const pool = mysql.createPool({
    connectionLimit : 10,
    // host            : 'localhost',
    user            : 'root',
    host:'emp.czw28o8goa1u.ap-south-1.rds.amazonaws.com',
    port      :  3308,

    password        : 'lakshay123',
    database        : 'emp'
});

// Verify connection
pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log('Connected as ID ' + connection.threadId);
});

app.get('/employees', (req, res) => {
    pool.query('SELECT * FROM employees', (error, results) => {
        if (error) throw error;
        res.send(results);
    });
});

// Add a new employee
app.post('/employees', (req, res) => {
    console.log(req.body);
    pool.query('INSERT INTO employees SET ?', req.body, (error, results) => {
        if (error) throw error;
        res.status(201).send(`Employee added with ID: ${results.insertId}`);
    });
});

// Update an employee
app.put('/employees/:id', (req, res) => {
    console.log(req.params,req.body);
    const { id } = req.params;
    pool.query('UPDATE employees SET ? WHERE id = ?', [req.body, id], (error, results) => {
        if (error) throw error;
        res.send('Employee updated successfully.');
    });
});

// Delete an employee
app.delete('/employees/:id', (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    pool.query('DELETE FROM employees WHERE id = ?', id, (error, results) => {
        if (error) throw error;
        res.send('Employee deleted successfully.');
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

// http.createServer(function (req, res) {
//     res.write('** Welcome to GlobalLogic!!!! **'); //write a response to the client
//     res.end(); //end the response
//   }).listen(80);