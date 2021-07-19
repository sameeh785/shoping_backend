const express = require("express");
const router = express.Router()
const { pushOrderInPurchaseList } = require("../controllers/user");
const { updateStock } = require("../controllers/product");
const { createOrder } = require("../controllers/order");

const { auth } = require("../middleware/auth");
router.post("/create/order/:id", auth,pushOrderInPurchaseList,updateStock,createOrder);
module.exports = router;
