const Sequelize = require("sequelize");

const sequelize = new Sequelize("expense", "root", "Dg@132000", {
  dialect: "mysql",
  host: "localhost",
  timezone: "+05:30",
});

module.exports = sequelize;
