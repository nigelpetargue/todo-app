const { Pool } = require('pg')

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'todos',
  user: 'postgres',
  password: '1122',
})

module.exports = pool
