const { Pool } = require("pg")
require("dotenv").config()

const isProduction = process.env.NODE_ENV === "production"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false }
    : false,
})

// Optional: log successful connection
pool.on("connect", () => {
  console.log("Connected to PostgreSQL")
})

module.exports = {
  query(text, params) {
    return pool.query(text, params)
  },
}
