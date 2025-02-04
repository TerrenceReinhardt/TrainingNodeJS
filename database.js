const mysql = require('mysql2');
require('dotenv').config();

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST, // Your MySQL host (e.g., localhost or an IP address)
    user: process.env.DB_USER, // Your MySQL username
    password: process.env.DB_PASS, // Your MySQL password
    database: process.env.DB_NAME, // Your MySQL database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise(); // Use promises for async/await

// Function to insert a user into the database
async function insertUser(name, email, status) {
    try {
        const sql = `INSERT INTO users (name, email, status) VALUES (?, ?, ?)`;
        const [result] = await pool.execute(sql, [name, email, status]);
        console.log(`User ${name} inserted with ID: ${result.insertId}`);
    } catch (err) {
        console.error('Error inserting user into the database:', err);
    }
}

// Export the insertUser function to use it in other files
module.exports = { insertUser };
