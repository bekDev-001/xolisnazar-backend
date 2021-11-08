const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    titleUz: {
      type: String,
      unique: true,
      required: true,
    },
    titleKr: {
      type: String,
      unique: true,
      required: true,
    },
    categoryImage: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", CategorySchema);
