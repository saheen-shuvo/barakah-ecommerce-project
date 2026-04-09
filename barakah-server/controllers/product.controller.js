const connectDB = require("../config/db");
const { ObjectId } = require("mongodb");

exports.getAllProducts = async (req, res) => {
  try {
    const db = await connectDB();
    const productsCollection = db.collection("products");

    const products = await productsCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();

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

exports.getSingleProduct = async (req, res) => {
  try {
    const db = await connectDB();
    const productsCollection = db.collection("products");
    const { id } = req.params;

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

// CREATE product
exports.createProduct = async (req, res) => {
  try {
    const db = await connectDB();
    const productsCollection = db.collection("products");

    const {
      name,
      category,
      subcategory,
      price,
      oldPrice,
      image,
      badge,
      inStock,
      rating,
    } = req.body;

    const newProduct = {
      name: name?.trim() || "",
      category: category?.trim() || "",
      subcategory: subcategory?.trim() || "",
      price: Number(price) || 0,
      oldPrice: Number(oldPrice) || 0,
      image: image?.trim() || "",
      badge: badge?.trim() || "",
      inStock: typeof inStock === "boolean" ? inStock : true,
      rating: Number(rating) || 0,
      createdAt: new Date(),
    };

    const result = await productsCollection.insertOne(newProduct);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const db = await connectDB();
    const productsCollection = db.collection("products");
    const { id } = req.params;

    const {
      name,
      category,
      subcategory,
      price,
      oldPrice,
      image,
      badge,
      inStock,
      rating,
    } = req.body;

    const existingProduct = await productsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updatedDoc = {
      name: name?.trim() || existingProduct.name,
      category: category?.trim() || existingProduct.category,
      subcategory: subcategory?.trim() || existingProduct.subcategory || "",
      price: Number(price) || 0,
      oldPrice: Number(oldPrice) || 0,
      image: image?.trim() || existingProduct.image,
      badge: badge?.trim() || "",
      inStock: typeof inStock === "boolean" ? inStock : existingProduct.inStock,
      rating: Number(rating) || 0,
      updatedAt: new Date(),
    };

    const result = await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedDoc },
    );

    res.json({
      success: true,
      message: "Product updated successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const db = await connectDB();
    const productsCollection = db.collection("products");
    const { id } = req.params;

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
