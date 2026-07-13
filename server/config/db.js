const { Sequelize } = require('sequelize')

// Sequelize instance (uses DB_NAME). We will ensure the DB exists before authenticating.
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
)

const ensureDatabaseExists = async () => {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env

  if (!DB_NAME) {
    throw new Error('Missing environment variable: DB_NAME')
  }
  if (!DB_HOST) {
    throw new Error('Missing environment variable: DB_HOST')
  }
  if (!DB_USER) {
    throw new Error('Missing environment variable: DB_USER')
  }

  // Create DB using a separate raw connection without selecting the DB.
  // mysql2 is already dependency in server/package.json
  const mysql = require('mysql2/promise')

  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT || 3306,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true,
  })

  try {
    // Note: DB_NAME cannot be passed as a parameter safely for identifiers,
    // so we escape it as an identifier.
    const escapedDbName = `\`${String(DB_NAME).replace(/`/g, '``')}\``
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${escapedDbName}`)
  } finally {
    await connection.end()
  }
}

const connectDB = async () => {
  try {
    await ensureDatabaseExists()
    await sequelize.authenticate()
    console.log(`MySQL connected: ${process.env.DB_HOST}/${process.env.DB_NAME}`)
  } catch (error) {
    console.error(`MySQL connection error: ${error.message}`)
    process.exit(1)
  }
}
console.log({
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? "Loaded" : "Missing",
  DB_NAME: process.env.DB_NAME,
});

module.exports = { sequelize, connectDB }
