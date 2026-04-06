const express = require("express");
const cors = require("cors");

const testRoutes = require("./routes/test.routes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api", testRoutes);

// server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});