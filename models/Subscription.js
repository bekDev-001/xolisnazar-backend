const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: Number,
    },
    subscriptionMonths: {
      type: String,
    },
    date: {
      type: String,
    },
    amount: {
      type: Number,
    },
    type: {
      type: String,
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

module.exports = mongoose.model("Subscription", SubscriptionSchema);
