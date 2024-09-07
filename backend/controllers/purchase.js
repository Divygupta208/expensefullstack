const Order = require("../models/order");
const User = require("../models/user");
const Razorpay = require("razorpay");

exports.purchasePremiumMembership = async (req, res) => {
  const t = await sequelize.transaction();

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

    const newOrder = await Order.create(
      {
        userId: user.id,
        orderId: order.id,
        status: "PENDING",
      },
      { transaction: t }
    );

    await t.commit();

    res.json({
      order,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    await t.rollback();

    console.error(err);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { order_id, payment_id } = req.body;

    const order = await Order.findOne(
      { where: { orderId: order_id } },
      { transaction: t }
    );

    if (!order) {
      await t.rollback();
      return res.status(404).json({ error: "Order not found" });
    }

    if (payment_id) {
      order.paymentId = payment_id;
      order.status = "SUCCESSFUL";
      await order.save({ transaction: t });

      const user = await User.findByPk(order.userId, { transaction: t });

      if (user) {
        user.isPremium = true;
        await user.save({ transaction: t });
      }

      const newToken = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          isPremium: user.isPremium,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      await t.commit();

      return res.json({
        success: true,
        message: "Payment successful and order updated",
        token: newToken,
      });
    } else {
      order.status = "FAILED";
      await order.save({ transaction: t });

      await t.commit();

      return res
        .status(400)
        .json({ success: false, message: "Payment failed, order updated" });
    }
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res
      .status(500)
      .json({ error: "Failed to update transaction status" });
  }
};
