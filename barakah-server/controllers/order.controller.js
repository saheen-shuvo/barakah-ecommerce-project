const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");
const {
  transformOrderToSteadfast,
  callSteadfast,
} = require("../utils/steadfast");
const { sendAdminOrderNotification } = require("../lib/emailService");

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

    const newOrder = {
      ...orderData,
      _id: result.insertedId, // Add MongoDB ID
    };

    sendAdminOrderNotification(newOrder).catch((err) => {
      console.error("❌ Failed to send email:", err.message);
      // Don't throw - order is already created, email is optional
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      insertedId: result.insertedId,
      data: newOrder, 
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

// This API is called by AnalyticsCard.jsx to get analytics for a specific date range for export
exports.getDeliveredAnalytics = async (req, res) => {
  try {
    const db = await connectDB();
    const ordersCollection = db.collection("orders");

    // Get startDate and endDate from query params
    const { startDate, endDate } = req.query;

    // Validate dates
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate and endDate are required",
      });
    }

    // Parse dates
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include entire end date

    // Create date filter for range
    const dateFilter = {
      $gte: start,
      $lte: end,
    };

    const [
      deliveredOrders,
      cancelledCount,
      pendingCount,
      totalOrders,
      totalOrdersRevenueAgg,
      cancelledRevenueAgg,
    ] = await Promise.all([
      ordersCollection
        .find({ status: "delivered", createdAt: dateFilter })
        .toArray(),
      ordersCollection.countDocuments({
        status: "cancelled",
        createdAt: dateFilter,
      }),
      ordersCollection.countDocuments({
        status: "pending",
        createdAt: dateFilter,
      }),
      ordersCollection.countDocuments({
        createdAt: dateFilter,
      }),
      ordersCollection
        .aggregate([
          { $match: { createdAt: dateFilter } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ])
        .toArray(),
      ordersCollection
        .aggregate([
          { $match: { status: "cancelled", createdAt: dateFilter } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ])
        .toArray(),
    ]);

    const deliveredCount = deliveredOrders.length;
    const totalRevenue = deliveredOrders.reduce(
      (sum, order) => sum + (Number(order.total) || 0),
      0,
    );
    const totalOrdersRevenue = totalOrdersRevenueAgg[0]?.total || 0;
    const cancelledRevenue = cancelledRevenueAgg[0]?.total || 0;

    res.json({
      success: true,
      data: {
        startDate,
        endDate,
        totalOrders,
        totalOrdersRevenue,
        deliveredOrders: deliveredCount,
        deliveredRevenue: totalRevenue,
        totalCancelled: cancelledCount,
        cancelledRevenue,
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

// This API is called by AnalyticsCard.jsx to get orders for a specific date range for export
exports.getOrdersForExport = async (req, res) => {
  try {
    const db = await connectDB();
    const ordersCollection = db.collection("orders");

    const { startDate, endDate } = req.query;

    // Validate dates
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "startDate and endDate are required",
      });
    }

    // Parse dates
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include entire end date

    // Date range filter
    const dateRange = { $gte: start, $lte: end };

    const orders = await ordersCollection
      .find({
        $or: [
          { status: "delivered", deliveredAt: dateRange },
          { status: "cancelled", cancelledAt: dateRange },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//DateAnalyticsCard.jsx will call this API to get analytics for a specific date
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

    const [totalOrders, delivered, cancelled, revenueAgg, cancelledRevenueAgg] =
      await Promise.all([
        ordersCollection.countDocuments({
          createdAt: { $gte: from, $lte: to },
        }),
        ordersCollection
          .find({
            status: "delivered",
            createdAt: { $gte: from, $lte: to },
          })
          .toArray(),
        ordersCollection.countDocuments({
          status: "cancelled",
          createdAt: { $gte: from, $lte: to },
        }),
        ordersCollection
          .aggregate([
            { $match: { createdAt: { $gte: from, $lte: to } } },
            { $group: { _id: null, total: { $sum: "$total" } } },
          ])
          .toArray(),
        ordersCollection
          .aggregate([
            {
              $match: {
                status: "cancelled",
                createdAt: { $gte: from, $lte: to },
              },
            },
            { $group: { _id: null, total: { $sum: "$total" } } },
          ])
          .toArray(),
      ]);

    const totalDelivered = delivered.length;
    const totalRevenue = delivered.reduce(
      (sum, order) => sum + (Number(order.total) || 0),
      0,
    );
    const totalOrdersRevenue = revenueAgg[0]?.total || 0;
    const cancelledRevenue = cancelledRevenueAgg[0]?.total || 0;

    res.json({
      success: true,
      data: {
        date,
        totalOrders,
        totalDelivered,
        totalRevenue,
        totalOrdersRevenue,
        cancelledRevenue,
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
