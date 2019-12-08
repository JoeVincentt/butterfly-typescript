const functions = require("firebase-functions");
const cors = require("cors");
const stripe = require("stripe")(functions.config().stripe.secretkey);
const { stripePayment } = require("./StripePayment");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.completePaymentWithStripe = functions.https.onRequest(
  (request, response) => {
    var corsFn = cors();
    corsFn(request, response, () => {
      stripePayment(request, response, stripe);
    });
  }
);
