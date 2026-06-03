const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  markOrderDelivered,
  sendToSteadfast,
  getOrderStats,
  cancelOrder,
  getDeliveredAnalytics,
} = require("../controllers/order.controller");

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/stats", getOrderStats);
router.get("/analytics", getDeliveredAnalytics);
router.patch("/:id/deliver", markOrderDelivered);
router.patch("/:id/steadfast", sendToSteadfast);
router.patch("/:id/cancel", cancelOrder);

module.exports = router;
