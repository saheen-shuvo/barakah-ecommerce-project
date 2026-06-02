const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  markOrderDelivered,
  sendToSteadfast,
} = require("../controllers/order.controller");

router.post("/", createOrder);
router.get("/", getOrders);
router.patch("/:id/deliver", markOrderDelivered);
router.patch("/:id/steadfast", sendToSteadfast);

module.exports = router;