const Sequelize = require("sequelize");

const sequelize = new Sequelize("expensetracker", "divygupta", "divy132000", {
  dialect: "mysql",
  host: "database-1.cbiwoy48oi75.ap-south-1.rds.amazonaws.com",
  timezone: "+05:30",
});

module.exports = sequelize;

// const sequelize = new Sequelize("expense", "root", "Dg@132000", {
//   dialect: "mysql",
//   host: "localhost",
//   timezone: "+05:30",
// });

// module.exports = sequelize;
