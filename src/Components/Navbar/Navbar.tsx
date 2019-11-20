import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ListIcon from "@material-ui/icons/List";
import CategoryIcon from "@material-ui/icons/Category";
import Hidden from "@material-ui/core/Hidden";
import withWidth from "@material-ui/core/withWidth";
import Fab from "@material-ui/core/Fab";

import logo from "../../images/logo_horizontal.png";

import MenuDrawer from "./MenuDrawer";
import AccountMenu from "./AccountMenu";

const Navbar: React.FC = () => {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);
  const [loggedIn, setLogIn] = React.useState<boolean>(false);

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
            <img
              alt="ButterflyRemoteJobsLogo"
              src={logo}
              className={classes.logo}
            />
          </div>

          <Hidden xsDown>
            <Fab
              onClick={() => console.log("Post a Job")}
              color="primary"
              variant="extended"
              size="medium"
              aria-label="postJob"
              className={classes.postJobButton}
            >
              Post a Job
            </Fab>

            {!loggedIn && (
              <Fab
                onClick={() => setLogIn(true)}
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
    background: "#fafafa"
  },

  title: {
    flexGrow: 1
  },
  logo: {
    height: "auto",
    width: 180
  },
  loginButton: {
    margin: theme.spacing(1),
    color: "#ac00d5",
    backgroundColor: "#f4f4f4"
  },
  menuButton: {
    color: "#ac00d5"
  },
  postJobButton: {
    margin: theme.spacing(1),
    background: "linear-gradient(to bottom, #ff00cc, #333399)"
  }
}));

Navbar.propTypes = {
  width: PropTypes.oneOf(["lg", "md", "sm", "xl", "xs"]).isRequired
};

export default withWidth()(Navbar);
