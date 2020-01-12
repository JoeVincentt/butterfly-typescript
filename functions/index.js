const functions = require("firebase-functions");
const path = require("path");
const os = require("os");
const fs = require("fs");
const cors = require("cors");
//Initialize Algolia Search Client
const algoliasearch = require("algoliasearch");
const client = algoliasearch(
  functions.config().algolia.appid,
  functions.config().algolia.apikey
);
//Initialize Admin SDK
const admin = require("firebase-admin");
admin.initializeApp();
//Initialize Stripe
const stripe = require("stripe")(functions.config().stripe.secretkey);
//Initialize SendGrid
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(functions.config().sendgrid.key);

//Import Functions
const { stripePayment } = require("./StripePayment");
const { contactUsEmail } = require("./ContactUsEmail");
const { notifyEmployerEmail } = require("./NotifyEmployerEmail");
const { jobPostingExpireCleanUp } = require("./JobPostingExpireCleanUp");
const {
  createIndex,
  removeIndexOnDelete,
  removeIndexOnExpire
} = require("./JobIndex");
const { createUrlIndex, returnSitemap, removeUrlIndex } = require("./Sitemap");
const { returnLandingPage } = require("./LandingPage");
const { cleanUpDependencies } = require("./CleanUpJobDependencies");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

//STRIPE PAYMENTS
exports.completePaymentWithStripe = functions.https.onRequest(
  (request, response) => {
    var corsFn = cors();
    corsFn(request, response, () => {
      stripePayment(request, response, stripe, admin);
    });
  }
);

//SENDGRID EMAIL SERVICES
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

//JOB POSTING MANAGER

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

//ALGOLIA RELATED INDEXING
exports.indexJobOnCreate = functions.firestore
  .document("jobs/{jobID}")
  .onCreate((snapshot, context) => {
    return createIndex(snapshot, client);
  });

exports.unindexJobOnDelete = functions.firestore
  .document("jobs/{jobID}")
  .onDelete((snapshot, context) => {
    return removeIndexOnDelete(snapshot, client);
  });

exports.unindexJobOnExpiredUpdate = functions.firestore
  .document("jobs/{jobID}")
  .onUpdate((change, context) => {
    return removeIndexOnExpire(change, client);
  });

//JOB CLEAN-UP ON DELETE
exports.cleanUpJobDependencies = functions.firestore
  .document("jobs/{jobID}")
  .onDelete((snapshot, context) => {
    return cleanUpDependencies(snapshot, admin);
  });

//UPDATE SITEMAP.TXT
exports.createSitemapUrlIndex = functions.firestore
  .document("jobs/{jobID}")
  .onCreate((snapshot, context) => {
    return createUrlIndex(snapshot, admin, path, os, fs);
  });

exports.removeSitemapUrlIndex = functions.firestore
  .document("jobs/{jobID}")
  .onDelete((snapshot, context) => {
    return removeUrlIndex(snapshot, admin);
  });

//RETURN SITEMAP FOR SEO CRAWLERS
exports.returnSitemapFunction = functions.https.onRequest(
  (request, response) => {
    var corsFn = cors();
    corsFn(request, response, () => {
      returnSitemap(request, response, admin);
    });
  }
);
//RETURN LANDING PAGE
exports.returnLandingPageFunction = functions.https.onRequest(
  (request, response) => {
    var corsFn = cors();
    corsFn(request, response, () => {
      returnLandingPage(request, response);
    });
  }
);
