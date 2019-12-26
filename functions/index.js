const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const cors = require("cors");
const stripe = require("stripe")(functions.config().stripe.secretkey);
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(functions.config().sendgrid.key);
const { stripePayment } = require("./StripePayment");
const { contactUsEmail } = require("./ContactUsEmail");
const { notifyEmployerEmail } = require("./NotifyEmployerEmail");
const { jobPostingExpireCleanUp } = require("./JobPostingExpireCleanUp");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.completePaymentWithStripe = functions.https.onRequest(
  (request, response) => {
    var corsFn = cors();
    corsFn(request, response, () => {
      stripePayment(request, response, stripe, admin);
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

exports.notifyEmployerByEmailWhenNewApplication = functions.https.onRequest(
  (request, response) => {
    var corsFn = cors();
    corsFn(request, response, () => {
      notifyEmployerEmail(request, response, sgMail, admin);
    });
  }
);
// exports.scheduledFunction = functions.pubsub.schedule('every 5 minutes').onRun((context) => {
//   console.log('This will be run every 5 minutes!');
//   return null;
// });

exports.setJobPostingExpireCleanUp = functions.https.onRequest(
  (request, response) => {
    var corsFn = cors();
    corsFn(request, response, () => {
      jobPostingExpireCleanUp(request, response, admin);
    });
  }
);
