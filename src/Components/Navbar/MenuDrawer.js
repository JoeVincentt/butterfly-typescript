import React from "react";
import firebase from "firebase/app";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import CategoryIcon from "@material-ui/icons/Category";
import PersonIcon from "@material-ui/icons/Person";
import SpeedIcon from "@material-ui/icons/Speed";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Divider, Collapse } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import logo from "../../images/logo.png";

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

  const categoryList = [
    "Programming",
    "Design",
    "Copywriting",
    "DevOps & Sysadmin",
    "Business & Management",
    "Product",
    "Customer Support",
    "Finance and Legal",
    "Sales and Marketing",
    "Contract",
    "All Other"
  ];

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

  const renderCategoryList = categoryList =>
    categoryList.map((category, index) => (
      <div
        key={index}
        className={classes.list}
        role="presentation"
        onClick={() => setDrawerOpen(false)}
        onKeyDown={() => setDrawerOpen(false)}
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
          onClick={() => navigateTo("profile")}
          onKeyDown={() => navigateTo("profile")}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>

        <ListItem
          button
          onClick={() => navigateTo("dashboard")}
          onKeyDown={() => navigateTo("dashboard")}
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
        <Divider />

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
    width: 250
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
    margin: theme.spacing(3),
    width: 150,
    height: "auto"
  },
  nested: {
    paddingLeft: theme.spacing(4)
  }
}));

export default withRouter(MenuDrawer);
