const mongoose = require("mongoose");

const SoldNewspaperSchema = new mongoose.Schema(
  {
    newspaperid: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    paymentAmount: {
      type: Number,
      required: true,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SoldNewspaper", SoldNewspaperSchema);
