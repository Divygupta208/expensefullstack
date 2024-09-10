const Order = require("../models/order");
const User = require("../models/user");
const Razorpay = require("razorpay");
const sequelize = require("../util/database");
const jwt = require("jsonwebtoken");

exports.purchasePremiumMembership = async (req, res) => {
  const t = await sequelize.transaction();
  let createdOrderId = null;

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

    createdOrderId = order.id;

    await Order.create(
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
    });
  } catch (err) {
    await t.rollback();

    if (createdOrderId) {
      try {
        await Order.update(
          { status: "FAILED" },
          { where: { orderId: createdOrderId }, transaction: t }
        );
      } catch (updateError) {
        console.error("Failed to update order status:", updateError);
      }
    }

    console.error("Failed to create Razorpay order:", err);
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

    if (payment_id) {
      try {
        const orderToRefund = await Order.findOne({
          where: { orderId: order_id },
        });
        if (orderToRefund) {
          orderToRefund.status = "REFUNDED";
          await orderToRefund.save({ transaction: t });
        }
      } catch (refundError) {
        console.error(
          "Failed to update order status to REFUNDED:",
          refundError
        );
      }
    }

    console.error("Error updating transaction status:", err);
    return res
      .status(500)
      .json({ error: "Failed to update transaction status" });
  }
};
