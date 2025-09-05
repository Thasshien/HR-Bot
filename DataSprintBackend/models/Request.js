const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  employeeId: String,
  type: String,                // leave, asset issuance, etc.
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
  SLA_hours: { type: Number, default: 24 }, // SLA deadline in hours
  escalated: { type: Boolean, default: false }
});

module.exports = mongoose.model("Request", requestSchema);