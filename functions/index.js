const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY);

const app = express();

// Allow json requests & cors
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (request, response) => {
  response.status(200).send(process.env.REACT_APP_STRIPE_SECRET_KEY);
});

app.post("/payments/create", async (request, response) => {
  const total = request.params.total;

  console.log("Payment amount received: ", total);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total, // subunits of the currency
    currency: "usd",
  });

  response.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });
});

// Listen
exports.api = functions.https.onRequest(app);
