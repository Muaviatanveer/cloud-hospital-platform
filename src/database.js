const { Pool } = require('pg');

// Load environment variables from .env file
require('dotenv').config();

/**
 * Database configuration object using environment variables
 */
const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10),
};

/**
 * Create a new PostgreSQL connection pool
 */
const pool = new Pool(dbConfig);

/**
 * Function to execute a query against the database
 * @param {string} text - SQL query string
 * @param {Array} params - Array of parameters for the query
 * @returns {Promise<Object>} - Promise that resolves to the result of the query
 */
async function query(text, params) {
  try {
    const res = await pool.query(text, params);
    return res.rows;
  } catch (err) {
    console.error('Database query error:', err.stack);
    throw err;
  }
}

/**
 * Export the query function for use in other parts of the application
 */
module.exports = {
  query,
};