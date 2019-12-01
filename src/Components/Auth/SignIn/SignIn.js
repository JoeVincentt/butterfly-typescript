import React, { useState, useContext, useEffect } from "react";
import firebase from "firebase/app";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Link, withRouter } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Zoom from "@material-ui/core/Zoom";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";

import {
  UserStateContext,
  UserDispatchContext
} from "../../../StateManagement/UserState";

import GradientButton from "../../Buttons/GradientButton";
import logo from "../../../images/logo.png";
import "./SignIn.css";

import signInImageBackground from "../../../images/signUpInBackground.jpeg";

const SignIn = props => {
  const classes = useStyles();
  const db = firebase.firestore();

  //Use context
  const state = useContext(UserStateContext);
  const dispatch = useContext(UserDispatchContext);

  const [isSignedIn, setIsSignedIn] = useState(false);

  //State components
  const [zoomIn, setZoomIn] = useState(false);
  const [loading, setLoading] = useState(false);

  //State Sets
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //SignIN Error
  const [signInError, setSignInError] = useState(false);
  const [signInErrorCode, setSignInErrorCode] = useState("");
  const [signInErrorMessage, setSignInErrorMessage] = useState("");

  useEffect(() => {
    setZoomIn(true);
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user);
    });

    return () => {
      unregisterAuthObserver();
      setZoomIn(false);
      setLoading(false);
    };
  }, []);

  const handleEmailChange = e => setEmail(e.target.value);
  const handlePasswordChange = e => setPassword(e.target.value);

  const signInWithEmailAndPassword = () => {
    setLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setSignInError(false);
        const { uid } = firebase.auth().currentUser;
        db.collection("users")
          .doc(uid)
          .get()
          .then(doc => {
            if (doc.exists) {
              //set state
              let data = doc.data();
              dispatch({
                type: "login",
                payload: {
                  uid: uid,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  email: data.email
                }
              });
              props.history.push("/");
              return;
            } else {
              return;
            }
          })
          .catch(error => {
            setLoading(false);
            // console.log("Error getting document:", error);
          });
      })
      .catch(error => {
        // Handle Errors here.
        setLoading(false);
        setSignInError(true);
        setSignInErrorCode(error.code);
        setSignInErrorMessage(error.message);
      });
  };

  const createDatabaseInstanceOfTheUser = async (
    uid,
    firstName,
    lastName,
    email
  ) => {
    setLoading(true);
    try {
      const user = await db
        .collection("users")
        .doc(uid)
        .get();
      if (user.exists) {
        props.history.push("/");
        return;
      } else {
        try {
          await db
            .collection("subscriptions")
            .doc(uid)
            .set({
              email: email
            });
        } catch (error) {
          console.log(error);
        }
        try {
          await db
            .collection("users")
            .doc(uid)
            .set({
              uid: uid,
              firstName: firstName,
              lastName: lastName,
              email: email
            });
          props.history.push("/");
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

    // db.collection("users")
    //   .doc(uid)
    //   .get()
    //   .then(doc => {
    //     if (doc.exists) {
    //       //set state
    //       props.history.push("/");
    //       return;
    //     } else {
    //       db.collection("subscriptions")
    //         .doc(uid)
    //         .set({
    //           email: email
    //         })
    //         .catch(error => {});
    //       db.collection("users")
    //         .doc(uid)
    //         .set({
    //           uid: uid,
    //           firstName: firstName,
    //           lastName: lastName,
    //           email: email
    //         })
    //         .then(() => {
    //           props.history.push("/");
    //         })
    //         .catch(error => {});
    //     }
    //   })
    //   .catch(error => {
    //     setLoading(false);
    //     // console.log("Error getting document:", error);
    //   });
  };

  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: "/",
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => {
        const user = firebase.auth().currentUser;
        const { uid, displayName, email } = firebase.auth().currentUser;
        const fullName = displayName.split(" ");
        const firstName = fullName[0];
        const lastName = fullName[1];
        dispatch({
          type: "login",
          payload: {
            uid: uid,
            firstName: firstName,
            lastName: lastName,
            email: email
          }
        });
        createDatabaseInstanceOfTheUser(uid, firstName, lastName, email);

        return false;
      }
    }
  };

  const renderSingInError = () => {
    if (signInError) {
      return (
        <Typography variant="caption" className={classes.errorMessage}>
          Invalid Credentials
        </Typography>
      );
    }
  };

  const renderLoadingBar = () => {
    if (loading) {
      return <LinearProgress />;
    }
  };

  return (
    <Grid className={classes.image}>
      <Grid container direction="column" justify="center" alignItems="center">
        <Zoom in={zoomIn} style={{ transitionDelay: zoomIn ? "100ms" : "0ms" }}>
          <Grid item xs={12}>
            <div className={classes.shadowPaper}>
              <img src={logo} alt="logo" className={classes.logo} />
              <Typography component="h1" variant="h6">
                Sign In
              </Typography>
              <form className={classes.form} noValidate>
                <TextField
                  className={classes.textField}
                  variant="standard"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={e => handleEmailChange(e)}
                />
                <TextField
                  className={classes.textField}
                  variant="standard"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => handlePasswordChange(e)}
                />
                <Grid container direction="column">
                  {renderSingInError()}
                </Grid>
                <div style={{ height: "4px" }}>{renderLoadingBar()}</div>

                <Grid item className={classes.submit}>
                  <GradientButton
                    onClick={() => signInWithEmailAndPassword()}
                    text="Login"
                    labelName="loginButton"
                    size="large"
                  />
                </Grid>

                <StyledFirebaseAuth
                  uiConfig={uiConfig}
                  firebaseAuth={firebase.auth()}
                />

                <Grid container>
                  <Grid item>
                    <Link to="/sign-up" style={{ textDecoration: "none" }}>
                      <Typography variant="body2" color="textSecondary">
                        Don't have an account? Sign Up
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Grid>
        </Zoom>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  image: {
    height: "100vh",
    backgroundImage: `url(${signInImageBackground})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    "@media (max-height: 820px)": {
      height: "auto"
    }
  },
  shadowPaper: {
    padding: theme.spacing(4),
    margin: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "@media (max-width: 960px)": {
      margin: theme.spacing(1),
      marginTop: theme.spacing(5),
      padding: theme.spacing(2)
    },
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    boxShadow: "0 0 200px 0px rgba(70, 9, 125, 0.33)"
  },
  logo: {
    width: "100px",
    height: "auto",
    margin: theme.spacing(2)
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  textField: {
    minWidth: "100%"
  },
  submit: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  errorMessage: {
    color: "red"
  }
}));

export default withRouter(SignIn);
