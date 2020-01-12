const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
// Use the built-in express middleware for serving static files from './public'
app.use(cors({ origin: true }));
app.use(express.static(path.join(__dirname + "/public")));
app.get("*", (req, res) => {
  const date = new Date();
  const hours = (date.getHours() % 12) + 1; // London is UTC + 1hr;
  // [START_EXCLUDE silent]
  // Returns the number of seconds left before the next hour starts.
  function secondsLeftBeforeEndOfHour(date) {
    const m = date.getMinutes();
    const s = date.getSeconds();
    return 3600 - m * 60 - s;
  }
  //   res.set(
  //     "Cache-Control",
  //     `public, max-age=${secondsLeftBeforeEndOfHour(date)}`
  //   );
  // [END_EXCLUDE silent]
  // res.sendFile("index.html");
  res.sendFile("LandingPage.html", { root: path.join(__dirname, "/public") });
});

exports.returnLandingPage = functions.https.onRequest(app);
