const functions = require("firebase-functions");
const cors = require("cors");
const stripe = require("stripe")(functions.config().stripe.secretkey);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const handlePayment = (request, response) => {
  //   console.log(request.body);
  stripe.charges
    .create({
      amount: request.body.amount * 100,
      currency: "usd",
      source: request.body.token,
      description: `Charge for ${request.body.email}. Company ${request.body.companyName}`,
      receipt_email: request.body.email,
      metadata: {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        companyName: request.body.companyName
      }
    })
    .then(charge => {
      console.log(charge);
      return response.send(charge);
    })
    .catch(error => {
      console.log(error);
      return response.send(error);
    });
};

exports.completePaymentWithStripe = functions.https.onRequest(
  (request, response) => {
    var corsFn = cors();
    corsFn(request, response, () => {
      handlePayment(request, response);
    });
  }
);
