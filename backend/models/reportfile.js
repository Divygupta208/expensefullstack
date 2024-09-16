const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const ReportFile = sequelize.define("ReportFile", {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  fileUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
});

module.exports = ReportFile;
