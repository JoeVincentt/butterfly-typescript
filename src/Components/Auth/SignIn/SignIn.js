import React from "react";
import firebase from "firebase/app";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { Link, withRouter } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Zoom from "@material-ui/core/Zoom";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import GradientButton from "../../Buttons/GradientButton";
import logo from "../../../images/logo.png";
import "./SignIn.css";

import signInImageBackground from "../../../images/signUpInBackground.jpeg";

const SignIn = props => {
  const classes = useStyles();
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [zoomIn, setZoomIn] = React.useState(false);

  React.useEffect(() => {
    setZoomIn(true);
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(user => setIsSignedIn(!!user));

    return () => {
      unregisterAuthObserver();
      setZoomIn(false);
    };
  }, []);

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
        console.log(firebase.auth().currentUser);
        props.history.push("/");
      }
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
                />
                <Grid item className={classes.submit}>
                  <GradientButton
                    onClick={() => console.log("submit")}
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
  }
}));

export default withRouter(SignIn);
