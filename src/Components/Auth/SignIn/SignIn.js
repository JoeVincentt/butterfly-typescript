import React, { useState, useContext, useEffect } from "react";
import { useSnackbar } from "notistack";
import { Helmet } from "react-helmet";
import firebase from "firebase/app";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Link, withRouter } from "react-router-dom";
import {
  Zoom,
  TextField,
  Grid,
  Paper,
  Typography,
  LinearProgress
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { UserDispatchContext } from "../../../StateManagement/UserState";

import GradientButton from "../../Buttons/GradientButton";

const SignIn = props => {
  const classes = useStyles();
  const db = firebase.firestore();

  const { enqueueSnackbar } = useSnackbar();
  //Use context
  const dispatch = useContext(UserDispatchContext);

  //State components
  const [zoomIn, setZoomIn] = useState(false);
  const [loading, setLoading] = useState(false);

  //State Sets
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //SignIN Error
  const [signInError, setSignInError] = useState(false);

  useEffect(() => {
    setZoomIn(true);
    // const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
    //   // setIsSignedIn(!!user);
    // });
    return () => {
      // unregisterAuthObserver();
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
                  email: data.email,
                  country: data.country,
                  zipCode: data.zipCode,
                  timezone: data.timezone,
                  yearsOfExperience: data.yearsOfExperience,
                  resume: data.resume,
                  jobsApplied: data.jobsApplied
                }
              });
              props.history.push("/");
              enqueueSnackbar("Logged In", {
                variant: "success"
              });
              return;
            } else {
              return;
            }
          })
          .catch(error => {
            setLoading(false);
            enqueueSnackbar("Oops! Something went wrong! Please try again.", {
              variant: "error"
            });
            // console.log("Error getting document:", error);
          });
      })
      .catch(error => {
        // Handle Errors here.
        enqueueSnackbar("Oops! Something went wrong! Please try again.", {
          variant: "error"
        });
        setLoading(false);
        setSignInError(true);
      });
  };

  const checkIfUserExistsInDatabaseAndSetGlobalState = () => {
    setLoading(true);
    const { uid, displayName, email } = firebase.auth().currentUser;
    const fullName = displayName.split(" ");
    const firstName = fullName[0];
    const lastName = fullName[1];
    db.collection("users")
      .doc(uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          //set state
          //get profile and update global state
          let data = doc.data();

          dispatch({
            type: "login",
            payload: {
              uid: uid,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              country: data.country,
              zipCode: data.zipCode,
              timezone: data.timezone,
              yearsOfExperience: data.yearsOfExperience,
              resume: data.resume,
              jobsApplied: data.jobsApplied
            }
          });
          enqueueSnackbar("Logged In.", {
            variant: "success"
          });
          props.history.push("/");
          return;
        } else {
          db.collection("subscriptions")
            .doc(uid)
            .set({
              email: email
            })
            .catch(error => {});
          db.collection("dashboardStats")
            .doc(uid)
            .set({
              employerStats: {
                jobsPosted: 0,
                totalApplicants: 0,
                newApplicants: 0
              },
              employeeStats: {
                totalApplications: 0
              }
            })
            .catch(error => {});
          db.collection("users")
            .doc(uid)
            .set({
              uid: uid,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              date: Date.now(),
              firstName: firstName,
              lastName: lastName,
              email: email,
              country: "",
              zipCode: "",
              timezone: "",
              yearsOfExperience: "",
              resume: "",
              jobsApplied: []
            })
            .then(() => {
              db.collection("users")
                .doc(uid)
                .get()
                .then(doc => {
                  if (doc.exists) {
                    //set state
                    //get profile and update global state
                    let data = doc.data();
                    dispatch({
                      type: "login",
                      payload: {
                        uid: uid,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        country: data.country,
                        zipCode: data.zipCode,
                        timezone: data.timezone,
                        yearsOfExperience: data.yearsOfExperience,
                        resume: data.resume,
                        jobsApplied: data.jobsApplied
                      }
                    });
                    setLoading(false);
                    enqueueSnackbar("Logged In.", {
                      variant: "success"
                    });
                    props.history.push("/");
                  } else {
                  }
                })
                .catch(error => {
                  setLoading(false);
                  enqueueSnackbar(
                    "Oops! Something went wrong! Please try again.",
                    {
                      variant: "error"
                    }
                  );
                });
            })
            .catch(error => {
              setLoading(false);
              enqueueSnackbar("Oops! Something went wrong! Please try again.", {
                variant: "error"
              });
            });
        }
      })
      .catch(error => {
        setLoading(false);
        enqueueSnackbar("Oops! Something went wrong! Please try again.", {
          variant: "error"
        });
        // console.log("Error getting document:", error);
      });
  };

  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    // signInSuccessUrl: "/",
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => {
        checkIfUserExistsInDatabaseAndSetGlobalState();
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
    <React.Fragment>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <Grid className={classes.image}>
        <Grid container justify="center" alignItems="center">
          <Zoom
            in={zoomIn}
            style={{ transitionDelay: zoomIn ? "100ms" : "0ms" }}
          >
            <Grid item xs={12} sm={6} md={4} lg={4} xl={2}>
              <Paper className={classes.shadowPaper}>
                {/* <img src={logo} alt="logo" className={classes.logo} />
              <Typography component="h1" variant="h6">
                Sign In
              </Typography> */}
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
                    disabled={loading}
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
                    disabled={loading}
                    value={password}
                    onChange={e => handlePasswordChange(e)}
                  />
                  <Grid container direction="column">
                    {renderSingInError()}
                  </Grid>
                  <div style={{ height: "4px" }}>{renderLoadingBar()}</div>
                  <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    spacing={2}
                  >
                    <Grid item className={classes.submit}>
                      <GradientButton
                        onClick={() =>
                          loading ? () => {} : signInWithEmailAndPassword()
                        }
                        text="Login"
                        labelName="loginButton"
                        size="large"
                      />
                    </Grid>

                    <StyledFirebaseAuth
                      uiConfig={uiConfig}
                      firebaseAuth={firebase.auth()}
                    />

                    <Grid item>
                      <Link to="/sign-up" style={{ textDecoration: "none" }}>
                        <Typography variant="body2" color="textSecondary">
                          Don't have an account? Sign Up
                        </Typography>
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link
                        to="/reset-password"
                        style={{ textDecoration: "none" }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          Forgot password?
                        </Typography>
                      </Link>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>
          </Zoom>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const useStyles = makeStyles(theme => ({
  shadowPaper: {
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "@media (max-width: 960px)": {
      margin: theme.spacing(1),
      marginTop: theme.spacing(5),
      padding: theme.spacing(2)
    },
    backgroundColor: "rgba(255, 255, 255, 0.7)"
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
    marginTop: theme.spacing(2)
  },
  errorMessage: {
    color: "red"
  }
}));

export default withRouter(SignIn);
