const jwt = require("jsonwebtoken");

exports.checkPremium = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log("Premium Users Only");
  try {
    const decodedToken = jwt.verify(
      token,
      "b2a76f7c3e5f8d1a9c3b2e5d7f6a8c9b1e2d3f4a6b7c9e8d7f6b9c1a3e5d7f6b"
    );
    const isPremiumUser = decodedToken.isPremium;

    if (!isPremiumUser) {
      return res
        .status(403)
        .json({ message: "Access denied. Premium users only." });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
