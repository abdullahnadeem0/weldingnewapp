// models/Credit.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    notes: { type: String, default: "" },
  },
  { _id: true }
);

const creditSchema = new mongoose.Schema(
  {
    // Lender info (کس سے لیا)
    lenderName: { type: String, required: true, trim: true },
    lenderPhone: { type: String, default: "" },
    lenderAddress: { type: String, default: "" },

    // Credit details
    totalAmount: { type: Number, required: true, min: 0 },
    receivedDate: { type: Date, required: true, default: Date.now },
    dueDate: { type: Date, required: true },

    // Payments
    payments: [paymentSchema],

    // Linked order (optional)
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    purpose: { type: String, default: "" },

    notes: { type: String, default: "" },

    // Status — auto-calculated
    status: {
      type: String,
      enum: ["pending", "partial", "completed"],
      default: "pending",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Auto-calculate status before save
creditSchema.pre("save", function (next) {
  const paid = this.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  if (paid <= 0) this.status = "pending";
  else if (paid >= this.totalAmount) this.status = "completed";
  else this.status = "partial";
});

// Virtual fields
creditSchema.virtual("paidAmount").get(function () {
  return this.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
});

creditSchema.virtual("remainingAmount").get(function () {
  return this.totalAmount - this.paidAmount;
});

export default mongoose.model("Credit", creditSchema);