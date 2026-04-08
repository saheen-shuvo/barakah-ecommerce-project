const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  markOrderDelivered,
} = require("../controllers/order.controller");

router.post("/", createOrder);
router.get("/", getOrders);
router.patch("/:id/deliver", markOrderDelivered);

module.exports = router;