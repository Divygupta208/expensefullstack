const Order = require("../models/order");
const User = require("../models/user");
const Razorpay = require("razorpay");

exports.purchasePremiumMembership = async (req, res) => {
  try {
    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = 5000;
    const user = req.user;

    const order = await razorpayInstance.orders.create({
      amount: amount,
      currency: "INR",
      receipt: `receipt_order_${user.id}`,
    });

    console.log(order);

    const newOrder = await Order.create({
      userId: user.id,
      orderId: order.id,
      status: "PENDING",
    });

    res.json({
      order,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { order_id, payment_id } = req.body;
    const order = await Order.findOne({ where: { orderId: order_id } });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (payment_id) {
      order.paymentId = payment_id;
      order.status = "SUCCESSFUL";
      await order.save();

      const user = await User.findByPk(order.userId);

      if (user) {
        user.isPremium = true;
        await user.save();
      }

      const newToken = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          isPremium: user.isPremium,
        },
        "b2a76f7c3e5f8d1a9c3b2e5d7f6a8c9b1e2d3f4a6b7c9e8d7f6b9c1a3e5d7f6b",
        { expiresId: "1h" }
      );

      res.json({
        success: true,
        message: "Payment successful and order updated",
        token: newToken,
      });
    } else {
      order.status = "FAILED";
      await order.save();

      return res
        .status(400)
        .json({ success: false, message: "Payment failed, order updated" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update transaction status" });
  }
};
