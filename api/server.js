const express = require('express');
const app = express();
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const dotenv = require('dotenv');

app.use(express.json());
app.use(cors());
dotenv.config();

// Connection to database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Check if connection works
db.connect(err => {
  // if connection does not work
  if (err) return console.log('Error connecting to MYSQL');

  // if connection works successfully
  console.log('Connected to MYSQL as id: ', db.threadId);

  // Create a database
  db.query('CREATE DATABASE IF NOT EXISTS expense_tracker', (err, results) => {
    if (err) return console.log('err'); //error while creating database

    console.log('Database expense_tracker created/checked'); //db created successfully

    // Change our database
    db.changeUser({ database: 'expense_tracker' }, (err, result) => {
      if (err) return console.log(err); // error creating

      console.log('expense_tracker is in use');

      // create users table
      const usersTable = `
      CREATE TABLE IF NOT EXISTS users(
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(100) NOT NULL,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255)
      ) `;

      //Checking the table creation
      db.query(usersTable, (err, result) => {
        if (err) return console.log(err);
        console.log('users table created/checked');
      });

      // Create expense table
      const expensesTable = `
      CREATE TABLE IF NOT EXISTS expenses(
      id INT AUTO_INCREMENT PRIMARY KEY,
      users_id INT,
      amount DECIMAL(10,2),
      date DATE,
      category VARCHAR(50),
      FOREIGN KEY (users_id) REFERENCES users(id)
      ) `;

      //  checking the table creation
      db.query(expensesTable, (err, result) => {
        if (err) return console.log(err);
        console.log('expenses table created/checked');
      });
    });
  });
});

// Users registration route
app.post('/api/register', async (req, res) => {
  try {
    const users = 'SELECT * FROM users WHERE email = ?';
    //  check if user exist
    db.query(users, [req.body.email], (err, data) => {
      if (data.length > 0) return res.status(409).json('user already exists');

      // Hashing password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

      const newUser = `INSERT INTO users(email, username, password) VALUES (?)`;
      value = [req.body.email, req.body.username, hashedPassword];

      db.query(newUser, [value], (err, data) => {
        if (err) return req.status(400).json('Something went wrong');

        return req.status(200).json('user created successfully');
      });
    });
  } catch (err) {
    res.status(500).json('Internal server error');
  }
});

// Users login route
app.post('/api/login', async (req, res) => {
  try {
    const users = 'SELECT * FROM users WHERE email = ?';
    db.query(users, [req.body.email], (err, data) => {
      if (data.length === 0) return res.status(404).json('User not found');

      const isPasswordValid = bcrypt.compareSync(
        req.body.password,
        data[0].password
      );

      if (!isPasswordValid)
        return res.status(400).json('Invalid email or password');

      return res.status(200).json('Login is successful');
    });
  } catch (err) {
    if (err) return req.status().json('Internal server error');
  }
});

// app.post for authentication
// app.get('', (req, res) => {
//   res.send('<h1>Learning nodejs comes with lot of fun!</h1>');
// });

app.listen(3000, () => {
  console.log('server is running on port 3000');
});
