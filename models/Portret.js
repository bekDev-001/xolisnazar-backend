const mongoose = require("mongoose");

const PortretSchema = new mongoose.Schema(
  {
    iframe: {
      type: String,
      required: true,
    },
    titleUz: {
      type: String,
      required: true,
    },
    titleKr: {
      type: String,
      required: true,
    },
    youtubeLink: {
      type: String,
    },
    descriptionUz: {
      type: String,
    },
    descriptionKr: {
      type: String,
    },
    publishTime: {
      type: String,

      required: true,
    },
    youtubeLink: {
      type: String,
    },
    descriptionUz: {
      type: String,
    },
    descriptionKr: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("portret", PortretSchema);
