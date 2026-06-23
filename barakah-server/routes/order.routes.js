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
  getOrdersForExport,
  getOrdersByDate,
  getOrderCounts,
  verifyOrder,
  saveAbandonedOrder,
  getAbandonedOrders,
  deliverAbandonedOrder,
  cancelAbandonedOrder,
} = require("../controllers/order.controller");

router.post("/", createOrder);
router.post("/abandoned", saveAbandonedOrder);
router.get("/abandoned", getAbandonedOrders);
router.patch("/abandoned/:id/deliver", deliverAbandonedOrder);
router.patch("/abandoned/:id/cancel", cancelAbandonedOrder);
router.get("/", getOrders);
router.get("/counts", getOrderCounts);
router.get("/stats", getOrderStats);
router.get("/analytics", getDeliveredAnalytics);
router.get("/export", getOrdersForExport);
router.get("/by-date", getOrdersByDate);
router.patch("/:id/deliver", markOrderDelivered);
router.patch("/:id/steadfast", sendToSteadfast);
router.patch("/:id/cancel", cancelOrder);
router.patch("/:id/verify", verifyOrder);

module.exports = router;
