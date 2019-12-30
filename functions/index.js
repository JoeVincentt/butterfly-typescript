const functions = require("firebase-functions");
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

exports.indexJob = functions.firestore
  .document("jobs/{jobID}")
  .onCreate((snapshot, context) => {
    const jobSearchIndex = client.initIndex("job_search");
    const data = snapshot.data();
    const dataToIndex = {
      id: data.id,
      postedBy: data.postedBy,
      title: data.title,
      about: data.about,
      category: data.category,
      companyLocation: data.companyLocation,
      companyName: data.companyName,
      logo: data.logo,
      date: data.date,
      advertisementPlan: data.advertisementPlan,
      jobType: data.jobType
    };
    const objectID = snapshot.id; //or data.id

    //Add the data to the algolia index
    return jobSearchIndex.addObject({
      objectID,
      ...dataToIndex
    });
  });

exports.unindexJob = functions.firestore
  .document("jobs/{jobID}")
  .onDelete((snapshot, context) => {
    const jobSearchIndex = client.initIndex("job_search");
    const objectID = snapshot.id;

    //Delete an ID from the index
    return jobSearchIndex.deleteObject(objectID);
  });
