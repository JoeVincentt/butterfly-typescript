import React from "react";
import firebase from "firebase/app";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Divider,
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from "@material-ui/core";

import { ExpandLess, ExpandMore } from "@material-ui/icons";
import CategoryIcon from "@material-ui/icons/Category";
import HomeIcon from "@material-ui/icons/Home";
import SpeedIcon from "@material-ui/icons/Speed";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import logo from "../../images/logoFull.png";
import { categoryList } from "../../AdditionalResources/categoryList";

const MenuDrawer = ({
  setDrawerOpen,
  drawerOpen,
  history,
  isLoggedIn,
  dispatch
}) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const navigateTo = path => {
    setDrawerOpen(false);
    history.push(`/${path}`);
  };

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        dispatch({ type: "logOut" });
      })
      .catch(function(error) {
        // An error happened.
      });
    setDrawerOpen(false);
  };

  const navigateToCategory = (event, category) => {
    setDrawerOpen(false);
    let categoryID = category.toLowerCase();
    history.push({
      pathname: `/job-by-category/${categoryID}`,
      state: {
        categoryID,
        category
      }
    });
  };

  const renderCategoryList = categoryList =>
    categoryList.map((category, index) => (
      <div
        key={index}
        className={classes.list}
        role="presentation"
        onClick={e => navigateToCategory(e, category)}
        onKeyDown={e => navigateToCategory(e, category)}
      >
        <ListItem button key={index}>
          <ListItemText primary={category} />
        </ListItem>
      </div>
    ));

  const renderIfLoggedIn = () =>
    isLoggedIn && (
      <React.Fragment>
        <ListItem
          button
          onClick={() => navigateTo("dashboard-overview")}
          onKeyDown={() => navigateTo("dashboard-overview")}
        >
          <ListItemIcon>
            <SpeedIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
      </React.Fragment>
    );

  return (
    <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
      <img className={classes.logoImg} alt="Butterfly remote" src={logo}></img>
      <List>
        {/* <Divider /> */}
        <ListItem
          button
          color="primary"
          onClick={() => navigateTo("home")}
          onKeyDown={() => navigateTo("home")}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        {renderIfLoggedIn()}

        <ListItem button onClick={handleClick}>
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary="Categories" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button className={classes.nested}>
              <div className={classes.list} role="presentation">
                <List>{renderCategoryList(categoryList)}</List>
              </div>{" "}
            </ListItem>
          </List>
        </Collapse>

        <Divider />
        <ListItem
          button
          onClick={() => (isLoggedIn ? signOut() : navigateTo("sign-in"))}
          onKeyDown={() => (isLoggedIn ? signOut() : navigateTo("sign-in"))}
        >
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary={isLoggedIn ? "Sign Out" : "Sign In"} />
        </ListItem>
      </List>
    </Drawer>
  );
};

const useStyles = makeStyles(theme => ({
  list: {
    width: 150
  },
  fullList: {
    width: "auto"
  },
  categoryIcon: {
    marginRight: 10
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  logoImg: {
    margin: theme.spacing(1),
    alignSelf: "center",
    width: 150,
    height: "auto"
  },
  nested: {
    // paddingLeft: theme.spacing(4)
  }
}));

export default withRouter(MenuDrawer);
