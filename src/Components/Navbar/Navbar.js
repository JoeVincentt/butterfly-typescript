import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";

import { useSnackbar } from "notistack";
import firebase from "firebase/app";
import "firebase/firestore";
import { makeStyles, fade } from "@material-ui/core/styles";

import {
  Button,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Hidden,
  withWidth,
  Fab,
  InputBase,
  Typography
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import SpeedIcon from "@material-ui/icons/Speed";
import MenuIcon from "@material-ui/icons/Menu";

import GradientButton from "../Buttons/GradientButton";
import CategoryMenuButton from "./CategoryMenu";
import MenuDrawer from "./MenuDrawer";
import {
  UserStateContext,
  UserDispatchContext
} from "../../StateManagement/UserState";
import colors from "../../constants/colors";

const Navbar = props => {
  const classes = useStyles();
  const db = firebase.firestore();

  const state = useContext(UserStateContext);
  const dispatch = useContext(UserDispatchContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { isLoggedIn } = state;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigateToLoginScreen = () => props.history.push("/sign-in");

  useEffect(() => {
    checkIfSignedIn();
  }, []);

  const checkIfSignedIn = () => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        if (state.uid === "") {
          // User is signed in.
          const { uid } = user;
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
              }
              // props.history.push("/");
            })
            .catch(error => {
              // console.log(error);
            });
        }
      } else {
        // No user is signed in.
      }
    });
  };

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        enqueueSnackbar("Logged Out.", {
          variant: "warning"
        });
        dispatch({ type: "logOut" });
      })
      .catch(function(error) {
        // An error happened.
      });
  };

  return (
    <div>
      <MenuDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        isLoggedIn={isLoggedIn}
        dispatch={dispatch}
      />
      <AppBar position="fixed" elevation={1} className={classes.appBar}>
        <Toolbar>
          <Hidden mdUp>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={() => {
                setDrawerOpen(true);
              }}
            >
              <MenuIcon />
            </IconButton>
          </Hidden>

          <div className={classes.buttonBar}>
            <Hidden smDown>
              <Grid container direction="row" alignItems="center">
                <Link to="/" style={{ textDecoration: "none" }}>
                  <Button
                    color="primary"
                    className={classes.button}
                    size="large"
                    startIcon={<HomeIcon />}
                  >
                    Home
                  </Button>
                </Link>
                {isLoggedIn && (
                  <Link
                    to="/dashboard-overview"
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      color="primary"
                      className={classes.button}
                      size="large"
                      startIcon={<SpeedIcon />}
                    >
                      Dashboard
                    </Button>
                  </Link>
                )}
                <CategoryMenuButton />
              </Grid>
            </Hidden>
          </div>
          <GradientButton
            onClick={() => props.history.push("/find-a-job")}
            size="medium"
            labelName="quick search"
            text="Find a job"
          />

          <Hidden xsDown>
            <Fab
              onClick={() => (isLoggedIn ? signOut() : navigateToLoginScreen())}
              color="inherit"
              variant="extended"
              size="medium"
              aria-label="login"
              className={classes.loginButton}
            >
              {isLoggedIn ? "Sign Out" : "Sign In"}
            </Fab>
          </Hidden>
        </Toolbar>
      </AppBar>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  // root: {
  //   flexGrow: 1
  // },
  appBar: {
    background: "#ffffff",
    boxShadow: "0 0 10px 0px rgba(107, 19, 107, 0.2)"
  },

  buttonBar: {
    flexGrow: 1
  },
  button: {
    margin: theme.spacing(1)
  },
  logo: {
    marginLeft: theme.spacing(2),
    height: "auto",
    width: 180
  },
  loginButton: {
    margin: theme.spacing(1),
    color: colors.purple,
    backgroundColor: colors.grey
  },
  menuButton: {
    color: colors.purple
  },
  postJobButton: {
    margin: theme.spacing(1),
    background: `linear-gradient(to bottom, #8e24aa, #333399)`
  }
}));

Navbar.propTypes = {
  width: PropTypes.oneOf(["lg", "md", "sm", "xl", "xs"]).isRequired
};

export default withRouter(withWidth()(Navbar));
