const User = require("../models/user");
const { jsPDF } = require("jspdf");
require("jspdf-autotable");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-south-1",
});

const uploadToS3 = (data, filename) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
    ContentType: "application/pdf",
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading to S3:", err);
        reject(err);
      } else {
        console.log("File uploaded successfully:", data.Location);
        resolve(data.Location);
      }
    });
  });
};

exports.getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await User.findAll({
      attributes: ["id", "name", "email", "totalExpense"],
      order: [["totalExpense", "DESC"]],
    });

    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};

const getWeekStartDate = (year, month, week) => {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const startDay = 1 + (week - 1) * 7 - firstDayOfWeek;
  return new Date(year, month - 1, startDay);
};

const getWeekEndDate = (startDate) => {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  return endDate;
};

exports.getReports = async (req, res, next) => {
  try {
    const user = req.user;
    const { year, month, week } = req.query;
    const allExpenses = await user.getExpenses();

    if (!allExpenses.length) {
      return res.status(404).json({ message: "No expenses found" });
    }

    const filteredExpenses = allExpenses.filter((expense) => {
      const expDate = new Date(expense.createdAt);
      const isSameYear = expDate.getFullYear() === Number(year);
      const isSameMonth = expDate.getMonth() + 1 === Number(month);

      if (week === "all") {
        return isSameYear && isSameMonth;
      } else {
        const weekStartDate = getWeekStartDate(
          Number(year),
          Number(month),
          Number(week)
        );
        const weekEndDate = getWeekEndDate(weekStartDate);
        return (
          isSameYear &&
          isSameMonth &&
          expDate >= weekStartDate &&
          expDate <= weekEndDate
        );
      }
    });

    if (!filteredExpenses.length) {
      return res
        .status(404)
        .json({ message: "No expenses found for the selected period" });
    }

    let totalExpenses = 0;
    let totalIncome = 0;
    filteredExpenses.forEach((expense) => {
      if (expense.division === "expense") {
        totalExpenses += expense.price;
      } else if (expense.division === "income") {
        totalIncome += expense.price;
      }
    });

    // Initialize jsPDF instance
    const doc = new jsPDF();

    // Set report title
    doc.setFontSize(18);
    const monthName = new Date(year, month - 1).toLocaleString("default", {
      month: "long",
    });
    doc.text(`${monthName} Report`, 10, 10);

    // Add user info to the report
    doc.setFontSize(12);
    doc.text(`User: ${user.name}`, 10, 20);
    doc.text(`Email: ${user.email}`, 10, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 40);

    // Prepare data for the table
    const tableData = filteredExpenses.map((expense, index) => [
      index + 1,
      new Date(expense.createdAt).toLocaleDateString(),
      expense.category,
      expense.description,
      expense.division === "income" ? `₹${expense.price.toFixed(2)}` : "",
      expense.division === "expense" ? `₹${expense.price.toFixed(2)}` : "",
    ]);

    // Use autoTable to add expense data as a table in the PDF
    doc.autoTable({
      head: [["S.No", "Date", "Category", "Description", "Income", "Expense"]],
      body: tableData,
      startY: 50,
    });

    // Add totals
    doc.text(
      `Total Income: ₹${totalIncome.toFixed(2)}`,
      10,
      doc.autoTable.previous.finalY + 10
    );
    doc.text(
      `Total Expenses: ₹${totalExpenses.toFixed(2)}`,
      10,
      doc.autoTable.previous.finalY + 20
    );
    doc.text(
      `Net Savings: ₹${(totalIncome - totalExpenses).toFixed(2)}`,
      10,
      doc.autoTable.previous.finalY + 30
    );

    // Generate the PDF as an ArrayBuffer
    const pdfArrayBuffer = doc.output("arraybuffer");

    // Convert ArrayBuffer to Buffer (Node.js compatible format)
    const pdfBuffer = Buffer.from(pdfArrayBuffer);

    // Create a filename for the report
    const filename = `ExpenseReport-${user.id}-${new Date().toISOString()}.pdf`;

    // Upload the PDF buffer to S3
    const fileUrl = await uploadToS3(pdfBuffer, filename);

    // Respond with the S3 file URL
    res.status(200).json({ fileUrl });
  } catch (error) {
    console.error("Error generating PDF report:", error);
    res.status(500).json({ message: "Failed to generate report" });
  }
};
