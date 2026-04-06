const connectDB = require("../config/db");

exports.createOrder = async (req, res) => {
  try {
    const db = await connectDB();
    const ordersCollection = db.collection("orders");

    const {
      customerName,
      phone,
      address,
      district,
      area,
      notes,
      shippingType,
      shippingCost,
      items,
      subtotal,
      total,
    } = req.body;

    if (
      !customerName ||
      !phone ||
      !address ||
      !district ||
      !shippingType ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required order fields",
      });
    }

    const orderData = {
      customerName,
      phone,
      address,
      district,
      area: area || "",
      notes: notes || "",
      shippingType,
      shippingCost: Number(shippingCost) || 0,
      items,
      subtotal: Number(subtotal) || 0,
      total: Number(total) || 0,
      status: "pending",
      createdAt: new Date(),
    };

    const result = await ordersCollection.insertOne(orderData);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const db = await connectDB();
    const ordersCollection = db.collection("orders");

    const orders = await ordersCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};