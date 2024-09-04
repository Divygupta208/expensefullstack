const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const authenticateUser = require("./middleware/authuser");

const userRoute = require("./routes/user");
const expenseRoute = require("./routes/expense");
const User = require("./models/user");
const Expense = require("./models/expense");
app.use("/user", userRoute);
app.use("/expense", authenticateUser, expenseRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize
  .sync()
  .then((result) => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {});
