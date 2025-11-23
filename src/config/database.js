const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  // max: 20,
  // idleTimeoutMillis: 30000,
  // connectionTimeoutMillis: 2000,
});

// const pool = new Pool({
//   host: 'localhost',
//   port: 5432,
//   database: 'hrms_db',
//   user: 'postgres',
//   password: 'sholas@123',
//   // max: 20,
//   // idleTimeoutMillis: 30000,
//   // connectionTimeoutMillis: 2000,
// });

pool.on("connect", () => {
  console.log("Database connected successfully");
});

pool.on("error", (err) => {
  console.error("Unexpected database error:", err);
  process.exit(-1);
});

module.exports = pool;
