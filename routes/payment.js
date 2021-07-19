const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { getToken, processPayment } = require("../controllers/payment");
router.post("/payment/braintree/:id", auth, processPayment);
router.get("/payment/gettoken/:id", auth, getToken);

module.exports = router;
