// config/config.js for database (confguration for sequelize)
require("dotenv").config();

module.exports = {
  development: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    dialect: "mysql"
  },
  test: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE_TEST || "database_test",
    host: process.env.MYSQL_HOST,
    dialect: "mysql"
  },
  production: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE_PROD || "database_production",
    host: process.env.MYSQL_HOST,
    dialect: "mysql"
  }
};
