const config = require("./config");

const express = require("express");
const app = express();

const port = config.API_PORT || 3000;

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require("stripe")(config.SECRET_KEY);

app.post("/create-payment-intent", async (req, res) => {
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "sgd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// Call confirmPayment(), passing along the PaymentElement
// and a return_url to indicate where Stripe should redirect
// the user after they complete the payment.
// elements = stripe.elements({ appearance, clientSecret });
app.post("/confirm-payment", async (req, res) => {
  const confirmPayment = await stripe.confirmPayment({
    elements: req.body.elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: req.body.return_url,
    },
  });

  res.send(confirmPayment);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
