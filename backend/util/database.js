const Sequelize = require("sequelize");

const sequelize = new Sequelize("expense", "root", "Dg@132000", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
