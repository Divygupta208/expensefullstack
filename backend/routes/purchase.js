const express = require("express");

const router = express.Router();
const purchaseController = require("../controllers/purchase");

router.get("/premiummembership", purchaseController.purchasePremiumMembership);
router.post(
  "/updatetransactionstatus",
  purchaseController.updateTransactionStatus
);

module.exports = router;
