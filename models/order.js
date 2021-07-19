  const mongoose = require("mongoose")
const {ObjectId} = mongoose
const ProductCartSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    ref: "Product"
  },
  name: String,
  count: Number,
  price: Number
});
const ProductCart = mongoose.model("ProductCart", ProductCartSchema);
const orderSchema = new mongoose.Schema({
  products: [ProductCartSchema],
  transaction_id  : {},
  amount : {
    type : Number
  },
  user : {
    type : ObjectId,
    ref : "User"
  },
  address : String
},{timestamps : true})

module.exports = mongoose.model("Order",orderSchema)