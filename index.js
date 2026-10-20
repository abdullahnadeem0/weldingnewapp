import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import adminRoutes from "./routes/adminRoutes.js";
import creditRoutes from "./routes/creditRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminExpenseRoutes from "./routes/adminExpenseRoutes.js";
import adminPaymentRoutes from "./routes/adminPaymentRoutes.js";
import laborRoutes from "./routes/laborRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import adminMaterialRoutes from "./routes/adminMaterial.js";
import permissionRoutes from "./routes/permissionRoutes.js";
import quotationCustomerRoutes from "./routes/quotationCustomer.js";
import workerPaymentRoutes from "./routes/workerPayment.js";
import quotationMaterialRoutes from "./routes/quotationMaterial.js";
import quotationRoutes from "./routes/quotation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


// =========================
// Middleware
// =========================

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);


// =========================
// Static Files
// =========================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);


// =========================
// Routes
// =========================

app.use("/api/admin", adminRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/credits", creditRoutes);
app.use("/api/admin/expenses", adminExpenseRoutes);
app.use("/api/admin/payments", adminPaymentRoutes);

app.use("/api/labor", laborRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/roles", roleRoutes);

app.use("/api/quotation-materials", quotationMaterialRoutes);
app.use("/api/quotations", quotationRoutes);

app.use("/api/permissions", permissionRoutes);
app.use("/api/admin/materials", adminMaterialRoutes);
app.use("/api/quotation-customers", quotationCustomerRoutes);
app.use("/api/worker-payment", workerPaymentRoutes);


// =========================
// Health Check
// =========================

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend running",
    timestamp: new Date().toISOString(),
  });
});


// ========
// MongoDB Connection
// =========================

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");
    console.log(`📦 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);

    process.exit(1);
  }
};


// =========================
// Error Handler
// =========================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message,
  });
});


// =========================
// Start Local Server
// =========================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log("=================================");
    console.log("🚀 Server Started Successfully");
    console.log(`🌐 http://localhost:${PORT}`);
    console.log(`📦 MongoDB: ${mongoose.connection.name}`);
    console.log("=================================");
  });
};

startServer();