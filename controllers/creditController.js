// controllers/creditController.js
import Credit from "../models/Credit.js";

// GET all credits
export const getAllCredits = async (req, res) => {
  try {
    const credits = await Credit.find()
      .sort({ receivedDate: -1 })
      .populate("orderId", "billNumber customer");
    res.json({ success: true, data: credits });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET single
export const getCreditById = async (req, res) => {
  try {
    const credit = await Credit.findById(req.params.id).populate(
      "orderId",
      "billNumber customer"
    );
    if (!credit)
      return res
        .status(404)
        .json({ success: false, message: "Credit not found" });
    res.json({ success: true, data: credit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE
export const createCredit = async (req, res) => {
  try {
    const credit = new Credit(req.body);
    await credit.save();
    res.status(201).json({ success: true, data: credit });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE
export const updateCredit = async (req, res) => {
  try {
    const credit = await Credit.findById(req.params.id);
    if (!credit)
      return res
        .status(404)
        .json({ success: false, message: "Credit not found" });

    // Update fields
    const updatable = [
      "lenderName",
      "lenderPhone",
      "lenderAddress",
      "totalAmount",
      "receivedDate",
      "dueDate",
      "purpose",
      "notes",
      "orderId",
    ];
    updatable.forEach((field) => {
      if (req.body[field] !== undefined) credit[field] = req.body[field];
    });

    await credit.save();
    res.json({ success: true, data: credit });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE
export const deleteCredit = async (req, res) => {
  try {
    const credit = await Credit.findByIdAndDelete(req.params.id);
    if (!credit)
      return res
        .status(404)
        .json({ success: false, message: "Credit not found" });
    res.json({ success: true, message: "Credit deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ADD payment
export const addPayment = async (req, res) => {
  try {
    const credit = await Credit.findById(req.params.id);
    if (!credit)
      return res
        .status(404)
        .json({ success: false, message: "Credit not found" });

    credit.payments.push({
      amount: req.body.amount,
      date: req.body.date || new Date(),
      notes: req.body.notes || "",
    });

    await credit.save();
    res.json({ success: true, data: credit });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE payment
export const deletePayment = async (req, res) => {
  try {
    const credit = await Credit.findById(req.params.id);
    if (!credit)
      return res
        .status(404)
        .json({ success: false, message: "Credit not found" });

    credit.payments = credit.payments.filter(
      (p) => p._id.toString() !== req.params.paymentId
    );

    await credit.save();
    res.json({ success: true, data: credit });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};