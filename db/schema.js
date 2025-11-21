// db/schema.js
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  try {
    // Baca file SQL (schema.sql)
    const sqlPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Konek ke MySQL (tanpa pilih database dulu,
    // karena di SQL sudah ada "CREATE DATABASE" + "USE chill_db_adv")
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true, // penting: biar bisa jalankan banyak query sekaligus
    });

    console.log('Running schema.sql ...');
    await connection.query(sql);
    console.log('✅ Database & tables created successfully!');

    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error while initializing database:');
    console.error(err);
    process.exit(1);
  }
}

initDatabase();
