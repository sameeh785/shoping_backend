const Order = require("../models/order")
exports.createOrder = (req, res) => {
  req.body.user = req.params.id;
  const order = new Order(req.body)
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to save your order in DB"
      });
    }
    res.json(order);
  });
};