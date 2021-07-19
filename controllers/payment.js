const User = require("../models/user");
const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "49hxfzrnm4npckkx",
  publicKey: "2mpj2d3qr7kgy564",
  privateKey: "6b4a75d9015d1ad03bd1f8275286d277",
});
exports.getToken = async (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    if (err) {
      res.status(500).json({ msg: err });
    } else {
      res.send(response);
    }
  });
};

exports.processPayment = async (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;

  let amountFromTheClient = req.body.amount;
  gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,

      options: {
        submitForSettlement: true,
      },
    },
    function (err, result) {
      if (err) {
        console.log("error")
        res.status(500).json(error);
      } else {
        console.log(result)
        res.json(result);
      }
    }
  );
};
