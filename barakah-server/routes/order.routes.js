const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
} = require("../controllers/order.controller");

router.get("/", getOrders);
router.post("/", createOrder);

module.exports = router;