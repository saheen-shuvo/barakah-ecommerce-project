const { ObjectId } = require("mongodb");
const connectDB = require("../config/db");

// GET all products
exports.getProducts = async (req, res) => {
  try {
    const db = await connectDB();
    const productsCollection = db.collection("products");

    const products = await productsCollection.find().toArray();

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET single product
exports.getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const db = await connectDB();
    const productsCollection = db.collection("products");

    const product = await productsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST product
exports.createProduct = async (req, res) => {
  try {
    const db = await connectDB();
    const productsCollection = db.collection("products");

    const result = await productsCollection.insertOne(req.body);

    res.json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const db = await connectDB();
    const productsCollection = db.collection("products");

    const result = await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const db = await connectDB();
    const productsCollection = db.collection("products");

    const result = await productsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};