// test-sequelize.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

// kalau kamu pakai config/config.js milik sequelize-cli
const config = require('./config/config.js').development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false,
  }
);

async function test() {
  try {
    await sequelize.authenticate();
    console.log('✅ Koneksi Sequelize ke MySQL BERHASIL!');
  } catch (err) {
    console.error('❌ Gagal konek ke database:');
    console.error(err);
  } finally {
    await sequelize.close();
  }
}

test();
