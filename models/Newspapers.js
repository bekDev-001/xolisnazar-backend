const mongoose = require("mongoose");

const NewspaperSchema = new mongoose.Schema(
  {
    newspaperTitle: {
      type: String,
      required: true,
    },
    newspaperTitleKr: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    donwloadLink: {
      type: String,
      required: true,
    },
    paymentAmount: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("newspapers", NewspaperSchema);
