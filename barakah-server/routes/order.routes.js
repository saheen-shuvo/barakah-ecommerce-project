const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  markOrderDelivered,
  sendToSteadfast,
  getOrderStats,
  cancelOrder
} = require("../controllers/order.controller");

router.post("/", createOrder);
router.get("/", getOrders);
router.patch("/:id/deliver", markOrderDelivered);
router.patch("/:id/steadfast", sendToSteadfast);
router.get("/stats", getOrderStats);
router.patch("/:id/cancel", cancelOrder);

module.exports = router;