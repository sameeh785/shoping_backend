const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const product = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: true,
      maxlength: 32,
    },

    stock: {
      type: Number,
    },
    sold : {
      type : Number,
      default : 0
    },
    photo : {
      data: Buffer,
      contentType: String

    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", product);










// category: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "Category",
    //   required: true,
    // }