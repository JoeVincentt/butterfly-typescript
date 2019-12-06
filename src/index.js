import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import config from "./firebaseConfig";
// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp, analytics } from "firebase/app";
import "firebase/analytics";
// import "firebase/auth";
// import "firebase/firestore";
// import "firebase/storage";
initializeApp(config);
analytics();

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
