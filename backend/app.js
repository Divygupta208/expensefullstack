require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const authenticateUser = require("./middleware/authuser");
const userRoute = require("./routes/user");
const purchaseRoute = require("./routes/purchase");
const premiumRoute = require("./routes/premium");
const expenseRoute = require("./routes/expense");
const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");
const { checkPremium } = require("./middleware/checkpremium");
const ForgotPasswordRequest = require("./models/forgot-password-request");
const ReportFile = require("./models/reportfile");
const helmet = require("helmet");
const morgan = require("morgan");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(helmet.hidePoweredBy());

// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "access.log"),
//   { flags: "a" }
// );

// const errorLogStream = fs.createWriteStream(path.join(__dirname, "error.log"), {
//   flags: "a",
// });

// app.use(morgan("combined", { stream: accessLogStream }));

// app.use(express.static(path.join(__dirname, "public")));

app.use("/api/user", userRoute);
app.use("/api/expense", authenticateUser, expenseRoute);
app.use("/api/purchase", authenticateUser, purchaseRoute);
app.use("/api/premium", authenticateUser, checkPremium, premiumRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

User.hasMany(ReportFile);
ReportFile.belongsTo(User);

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "dist", "index.html"));
// });

// app.use((err, req, res, next) => {
//   const errorMessage = `${new Date().toISOString()} - Error: ${err.message}\n`;
//   console.error(errorMessage);
//   errorLogStream.write(errorMessage);
//   res.status(500).json({ message: "Something went wrong!" });
// });

sequelize
  .sync({ force: true })
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    const dbErrorMessage = `${new Date().toISOString()} - Database Error: ${
      err.message
    }\n`;
    console.error(dbErrorMessage);
    errorLogStream.write(dbErrorMessage);
  });
