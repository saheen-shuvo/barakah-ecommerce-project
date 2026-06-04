const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");
const {
  transformOrderToSteadfast,
  callSteadfast,
} = require("../utils/steadfast");

const extractSteadfastShipmentDetails = (steadfastResponse) => {
  const shipment = steadfastResponse?.consignment || steadfastResponse || {};

  const consignmentId =
    shipment.consignment_id ||
    shipment.consignmentId ||
    shipment.id ||
    shipment.tracking_code ||
    shipment.trackingCode ||
    null;

  const trackingUrl =
    shipment.tracking_link ||
    shipment.tracking_url ||
    shipment.trackingUrl ||
    (consignmentId
      ? `https://portal.packzy.com/api/v1/${consignmentId}`
      : null);

  return {
    consignmentId,
    trackingUrl,
    shipment,
  };
};

exports.createOrder = async (req, res) => {
  try {
    const db = await connectDB();
    const ordersCollection = db.collection("orders");

    const {
      customerName,
      phone,
      address,
      notes,
      shippingType,
      shippingCost,
      paymentMethod,
      accountLast4,
      items,
      subtotal,
      total,
      source,
    } = req.body;

    if (
      !customerName ||
      !phone ||
      !address ||
      !shippingType ||
      !items ||
      !paymentMethod ||
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
      notes: notes || "",
      shippingType,
      shippingCost: Number(shippingCost) || 0,
      items,
      subtotal: Number(subtotal) || 0,
      total: Number(total) || 0,
      status: "pending",
      createdAt: new Date(),
      paymentMethod,
      accountLast4,
      source: source || {
        traffic_source: "direct",
        traffic_medium: "",
        traffic_campaign: "",
      },
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

    const { page, limit, status } = req.query;
    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Number(limit) || 50, 100);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await ordersCollection.countDocuments(query);

    const orders = await ordersCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .toArray();

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getOrderCounts = async (req, res) => {
  try {
    const db = await connectDB();
    const ordersCollection = db.collection("orders");

    const [all, pending, delivered, cancelled] = await Promise.all([
      ordersCollection.countDocuments(),
      ordersCollection.countDocuments({ status: "pending" }),
      ordersCollection.countDocuments({ status: "delivered" }),
      ordersCollection.countDocuments({ status: "cancelled" }),
    ]);

    res.json({
      success: true,
      data: {
        all,
        pending,
        delivered,
        cancelled,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const db = await connectDB();
    const ordersCollection = db.collection("orders");

    const now = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last7Days = new Date();
    last7Days.setDate(now.getDate() - 7);

    const last30Days = new Date();
    last30Days.setDate(now.getDate() - 30);

    const [totalOrders, todayOrders, last7DaysOrders, last30DaysOrders] =
      await Promise.all([
        ordersCollection.countDocuments(),
        ordersCollection.countDocuments({
          createdAt: { $gte: today },
        }),
        ordersCollection.countDocuments({
          createdAt: { $gte: last7Days },
        }),
        ordersCollection.countDocuments({
          createdAt: { $gte: last30Days },
        }),
      ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        todayOrders,
        last7DaysOrders,
        last30DaysOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getDeliveredAnalytics = async (req, res) => {
  try {
    const db = await connectDB();
    const ordersCollection = db.collection("orders");

    const days = Number(req.query.days) || 1;

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days + 1);
    fromDate.setHours(0, 0, 0, 0);

    const dateFilter = { $gte: fromDate };

    const [deliveredOrders, cancelledCount, pendingCount, totalOrders] =
      await Promise.all([
        ordersCollection
          .find({ status: "delivered", deliveredAt: dateFilter })
          .toArray(),
        ordersCollection.countDocuments({
          status: "cancelled",
          cancelledAt: dateFilter,
        }),
        ordersCollection.countDocuments({
          status: "pending",
          createdAt: dateFilter,
        }),
        ordersCollection.countDocuments({
          createdAt: dateFilter,
        }),
      ]);

    const deliveredCount = deliveredOrders.length;
    const totalRevenue = deliveredOrders.reduce(
      (sum, order) => sum + (Number(order.total) || 0),
      0,
    );

    res.json({
      success: true,
      data: {
        days,
        totalOrders, // all orders regardless of status
        deliveredOrders: deliveredCount, // renamed from totalOrders
        totalRevenue,
        totalCancelled: cancelledCount,
        totalPending: pendingCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const db = await connectDB();
    const ordersCollection = db.collection("orders");

    const { id } = req.params;

    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "cancelled",
          cancelledAt: new Date(),
        },
      },
    );

    res.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.markOrderDelivered = async (req, res) => {
  try {
    const db = await connectDB();
    const ordersCollection = db.collection("orders");
    const { id } = req.params;

    const existingOrder = await ordersCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (existingOrder.status === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Order already delivered",
      });
    }

    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "delivered",
          deliveredAt: new Date(),
        },
      },
    );

    res.json({
      success: true,
      message: "Order marked as delivered",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getOrdersForExport = async (req, res) => {
  try {
    const db = await connectDB();
    const ordersCollection = db.collection("orders");

    const days = Number(req.query.days) || 7;

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days + 1);
    fromDate.setHours(0, 0, 0, 0);

    const orders = await ordersCollection
      .find({
        $or: [
          { status: "delivered", deliveredAt: { $gte: fromDate } },
          { status: "cancelled", cancelledAt: { $gte: fromDate } },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrdersByDate = async (req, res) => {
  try {
    const db = await connectDB();
    const ordersCollection = db.collection("orders");
    const { date } = req.query; // DD-MM-YYYY

    if (!date) {
      return res
        .status(400)
        .json({ success: false, message: "Date is required" });
    }

    // Parse DD-MM-YYYY manually
    const [dd, mm, yyyy] = date.split("-");
    if (!dd || !mm || !yyyy) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use DD-MM-YYYY",
      });
    }

    const from = new Date(Number(yyyy), Number(mm) - 1, Number(dd), 0, 0, 0, 0);
    const to = new Date(
      Number(yyyy),
      Number(mm) - 1,
      Number(dd),
      23,
      59,
      59,
      999,
    );

    const [totalOrders, delivered, cancelled] = await Promise.all([
      ordersCollection.countDocuments({
        createdAt: { $gte: from, $lte: to },
      }),
      ordersCollection
        .find({
          status: "delivered",
          deliveredAt: { $gte: from, $lte: to },
        })
        .toArray(),
      ordersCollection.countDocuments({
        status: "cancelled",
        cancelledAt: { $gte: from, $lte: to },
      }),
    ]);

    const totalDelivered = delivered.length;
    const totalRevenue = delivered.reduce(
      (sum, order) => sum + (Number(order.total) || 0),
      0,
    );

    res.json({
      success: true,
      data: {
        date,
        totalOrders,
        totalDelivered,
        totalRevenue,
        totalCancelled: cancelled,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendToSteadfast = async (req, res) => {
  try {
    const db = await connectDB();
    const ordersCollection = db.collection("orders");
    const { id } = req.params;

    const order = await ordersCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.steadfast && order.steadfast.consignmentId) {
      return res.status(400).json({
        success: false,
        message: "This order has already been sent to Steadfast",
      });
    }

    if (
      !order.customerName ||
      !order.phone ||
      !order.address ||
      order.total == null ||
      !order.items ||
      order.items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required order information. Ensure customer details and items are present.",
      });
    }

    const payload = transformOrderToSteadfast(order);
    const steadfastResponse = await callSteadfast(payload);

    const { consignmentId, trackingUrl, shipment } =
      extractSteadfastShipmentDetails(steadfastResponse);

    if (!consignmentId) {
      throw new Error(
        "Steadfast shipment was created but no consignment ID was returned.",
      );
    }

    const updateResult = await ordersCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          steadfast: {
            consignmentId: consignmentId,
            status: "sent",
            trackingUrl: trackingUrl,
            sentAt: new Date(),
            courierName: "Steadfast",
            response: shipment,
          },
        },
      },
    );

    const updatedOrder = await ordersCollection.findOne({
      _id: new ObjectId(id),
    });

    res.json({
      success: true,
      message: "Order sent to Steadfast successfully",
      data: updatedOrder.steadfast,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
