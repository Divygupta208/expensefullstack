const User = require("../models/user");
const { Op } = require("sequelize");

exports.postAddUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(403).json({
        message: "User already exists",
      });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    console.error("Error creating User:", err);

    res.status(500).json({
      message: "An error occurred while creating the user",
      error: err.message,
    });
    next(err);
  }
};
