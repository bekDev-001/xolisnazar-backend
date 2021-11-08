const mongoose = require("mongoose");

const ClickSchema = new mongoose.Schema(
  {
    click_trans_id: Number,
    service_id: Number,
    click_paydoc_id: Number,
    merchant_trans_id: {
      type: String,
      unique: true
    },
    amount: Number,
    action: Number,
    error: Number,
    error_note: String,
    sign_time: String,
    merchant_prepare_id: String
  },
  {
    timestamps: true,
    collection: 'click_transactions'
  }
);

module.exports = mongoose.model("ClickModel", ClickSchema);
