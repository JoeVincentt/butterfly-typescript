import React from "react";
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

const MenuDrawer = ({ setDrawerOpen, drawerOpen, history }) => {
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

  return (
    <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
      <img className={classes.logoImg} alt="Butterfly remote" src={logo}></img>
      <List>
        <Divider />

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
          onClick={() => setDrawerOpen(false)}
          onKeyDown={() => setDrawerOpen(false)}
        >
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Log Out" />
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
