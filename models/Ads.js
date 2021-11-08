const mongoose = require("mongoose");

const AdsSchema = new mongoose.Schema(
  {
    adsPhoto: {
      type: String,
    },
    adsLink: {
      type: String,
    },
    postedTime: {
      type: String,
    },
    homepage: {
      type: Boolean,
      default: false,
    },
    categoryId: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ads", AdsSchema);
