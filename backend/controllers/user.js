const User = require("../models/user");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

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

exports.postLoginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    return res.status(200).json({ message: "User Logged In", user });
  } catch (err) {
    console.log(err);

    return res.status(500).json({ message: "error occured ", error: err });
  }
};
