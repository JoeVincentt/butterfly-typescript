const functions = require("firebase-functions");
const cors = require("cors");
const stripe = require("stripe")(functions.config().stripe.secretkey);
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(functions.config().sendgrid.key);
const { stripePayment } = require("./StripePayment");
const { contactUsEmail } = require("./ContactUsEmail");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.completePaymentWithStripe = functions.https.onRequest(
  (request, response) => {
    var corsFn = cors();
    corsFn(request, response, () => {
      stripePayment(request, response, stripe);
    });
  }
);
exports.contactUsEmailSendToCustomerSupport = functions.https.onRequest(
  (request, response) => {
    var corsFn = cors();
    corsFn(request, response, () => {
      contactUsEmail(request, response, sgMail);
    });
  }
);
