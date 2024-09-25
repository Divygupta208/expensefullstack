const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.MySQL_DATABASE_NAME,
  process.env.MySQL_DATABASE_ID,
  process.env.MySQL_DATABASE_PASS,
  {
    dialect: "mysql",
    host: "localhost",
    timezone: "+05:30",
  }
);

module.exports = sequelize;
