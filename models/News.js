const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    titleKr: {
      type: String,
    },
    subTitle: {
      type: String,
    },
    subTitleKr: {
      type: String,
    },
    mainPhoto: {
      type: String,
    },
    paragraphUz: {
      type: String,
    },
    parapraphKr: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    hashTag: {
      type: String,
    },
    publishTime: {
      type: String,
    },
    categoryId: {
      type: String,
    },
    categoryName: {
      type: String
    },
    categoryNameKr: {
      type: String,
    },
    journalistName: {
      type: String,
    },
    journalistNameKr: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("News", NewsSchema);
