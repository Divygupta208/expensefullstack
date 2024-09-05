const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
require("dotenv").config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const authenticateUser = require("./middleware/authuser");

const userRoute = require("./routes/user");
const purchaseRoute = require("./routes/purchase");
const expenseRoute = require("./routes/expense");
const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");
app.use("/user", userRoute);
app.use("/expense", authenticateUser, expenseRoute);
app.use("/purchase", authenticateUser, purchaseRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
  .sync()
  .then((result) => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {});
