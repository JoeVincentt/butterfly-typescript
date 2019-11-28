import React from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Hidden from "@material-ui/core/Hidden";
import withWidth from "@material-ui/core/withWidth";
import Fab from "@material-ui/core/Fab";
import GradientButton from "../Buttons/GradientButton";

import logo from "../../images/logo_horizontal.png";

import colors from "../../constants/colors";

import MenuDrawer from "./MenuDrawer";

const Navbar = props => {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [loggedIn, setLogIn] = React.useState(false);

  const navigateToPostJobScreen = () => props.history.push("/post-a-job");

  const navigateToLoginScreen = () => props.history.push("/sign-in");

  return (
    <div>
      <MenuDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      <AppBar position="fixed" elevation={1} className={classes.appBar}>
        <Toolbar>
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

          <div className={classes.title}>
            <Link to="/">
              <img
                alt="ButterflyRemoteJobsLogo"
                src={logo}
                className={classes.logo}
              />
            </Link>
          </div>

          <Hidden xsDown>
            <GradientButton
              onClick={navigateToPostJobScreen}
              size="medium"
              labelName="postAJob"
              text="Post A Job"
            />

            {!loggedIn && (
              <Fab
                onClick={() => navigateToLoginScreen()}
                color="inherit"
                variant="extended"
                size="medium"
                aria-label="login"
                className={classes.loginButton}
              >
                Login
              </Fab>
            )}
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

  title: {
    flexGrow: 1
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
