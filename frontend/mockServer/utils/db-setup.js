// database.js
const Database = require('better-sqlite3');
const path = require('path');


const dbPath = path.resolve(__dirname, 'users.db');
const db = new Database(dbPath); // Creates or opens the file


const createTableStmt = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;

// Execute the statement to ensure the table exists
db.exec(createTableStmt);
console.log("Database connected and 'users' table ensured.");

// Optional: Add indices for faster lookups (good practice)
db.exec('CREATE INDEX IF NOT EXISTS idx_email ON users (email);');

// Export the database connection instance
module.exports = db;