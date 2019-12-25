import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import firebase from "firebase/app";
import "firebase/auth";
import { Helmet } from "react-helmet";
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

import GradientButton from "../../Buttons/GradientButton";

const SignIn = props => {
  const classes = useStyles();
  const auth = firebase.auth();

  const { enqueueSnackbar } = useSnackbar();

  //State components
  const [zoomIn, setZoomIn] = useState(false);
  const [loading, setLoading] = useState(false);

  //State Sets
  const [email, setEmail] = useState("");

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

  const resetPassword = () => {
    setLoading(true);
    auth
      .sendPasswordResetEmail(email)
      .then(function() {
        // Email sent.
        enqueueSnackbar("Check your Email for Instructions.", {
          variant: "success"
        });
        setEmail("");
        setLoading(false);
      })
      .catch(function(error) {
        // An error happened.
        enqueueSnackbar("Oops! Something went wrong! Please try again.", {
          variant: "error"
        });
        setEmail("");
        setLoading(false);
      });
  };

  const renderLoadingBar = () => {
    if (loading) {
      return <LinearProgress />;
    }
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Reset Password</title>
      </Helmet>
      <Grid className={classes.image}>
        <Grid container justify="center" alignContent="center">
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
                    onChange={e => setEmail(e.target.value)}
                  />

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
                        onClick={() => (loading ? () => {} : resetPassword())}
                        text="Reset Password"
                        labelName="loginButton"
                        size="large"
                      />
                    </Grid>

                    <Grid item>
                      <Link to="/sign-in" style={{ textDecoration: "none" }}>
                        <Typography variant="body2" color="textSecondary">
                          Have an account? Sign In
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

  errorMessage: {
    color: "red"
  }
}));

export default withRouter(SignIn);
