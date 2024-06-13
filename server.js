const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt');
const session = require('express-session');
app.use(cors());
app.use(express.json());



// Middleware
app.use(cors()); // Add CORS middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: '123asdfghjdfvbn', 
    resave: false,
    saveUninitialized: true
}));
// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'kemboi2024', 
    database: 'electrician_connect'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});


const path = require('path');


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes for each HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/directory', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'directory.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});


// Route for electrician registration
app.post('/register/electrician', (req, res) => {
    const { name, email, qualifications, password, location, photo, services_offered } = req.body;
    const sql = 'INSERT INTO electricians (name, email, qualifications, password, location, photo, services_offered) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, email, qualifications, password, location, photo, services_offered], (err, result) => {
        if (err) {
            res.status(500).send({ success: false, message: 'Registration failed' });
            throw err;
        }
        res.send({ success: true, message: 'Electrician registered successfully' });
    });
});

// Route for customer registration
app.post('/register/customer', (req, res) => {
    const { name, email, password } = req.body;
    const sql = 'INSERT INTO customers (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            res.status(500).send('Error registering customer');
            throw err;
        }
        res.status(200).send('Customer registered successfully');
    });
});




// Route to fetch all electricians
app.get('/electricians', (req, res) => {
    const query = 'SELECT * FROM electricians';
    db.query(query, (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    });
});

// Search for electricians
app.get('/search', (req, res) => {
    const query = req.query.q;
    const sql = `SELECT * FROM electricians WHERE name LIKE ? OR qualifications LIKE ?`;
    db.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {
        if (err) {
            res.status(500).send('Error searching electricians');
            throw err;
        }
        res.json(results);
    });
});

// Search for electricians
app.get('/search', (req, res) => {
    const query = req.query.q;
    const sql = `SELECT * FROM electricians WHERE name LIKE ? OR qualifications LIKE ?`;
    db.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {
        if (err) {
            res.status(500).send('Error searching electricians');
            throw err;
        }
        res.json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Endpoint to handle login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM customers WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            res.status(500).send({ success: false, message: 'Login failed' });
            throw err;
        }

        if (results.length > 0) {
            const user = results[0];
            // Compare hashed password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    res.status(500).send({ success: false, message: 'Login failed' });
                    throw err;
                }
                if (isMatch) {
                    req.session.user = user; // Store user in session
                    res.send({ success: true, message: 'Login successful', user: user });
                } else {
                    res.send({ success: false, message: 'Incorrect password' });
                }
            });
        } else {
            res.send({ success: false, message: 'User not found' });
        }
    });
});

// Endpoint to fetch customer profile
app.get('/customer/profile', (req, res) => {
    if (req.session.user) {
        const userId = req.session.user.id;
        const sql = 'SELECT id, name, email FROM customers WHERE id = ?';
        db.query(sql, [userId], (err, results) => {
            if (err) {
                res.status(500).send({ success: false, message: 'Failed to fetch profile' });
                throw err;
            }
            if (results.length > 0) {
                const profile = results[0];
                res.send({ success: true, profile: profile });
            } else {
                res.status(404).send({ success: false, message: 'Profile not found' });
            }
        });
    } else {
        res.status(401).send({ success: false, message: 'Unauthorized' });
    }
});

// Endpoint to handle logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.status(500).send({ success: false, message: 'Logout failed' });
            throw err;
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.send({ success: true, message: 'Logout successful' });
    });
});

