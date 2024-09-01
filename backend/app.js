const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const userRoute = require("./routes/user");
const expenseRoute = require("./routes/expense");
app.use("/user", userRoute);
app.use("/expense", expenseRoute);

sequelize
  .sync()
  .then((result) => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {});
