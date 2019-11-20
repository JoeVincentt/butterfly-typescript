import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import CategoryIcon from "@material-ui/icons/Category";
import PersonIcon from "@material-ui/icons/Person";
import SpeedIcon from "@material-ui/icons/Speed";
import WorkIcon from "@material-ui/icons/Work";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Divider, Collapse } from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import logo from "../../images/logo_horizontal.png";
import Fab from "@material-ui/core/Fab";

interface Props {
  setDrawerOpen: (set: boolean) => void;
  drawerOpen: boolean;
}

const MenuDrawer: React.FC<Props> = ({ setDrawerOpen, drawerOpen }) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState<boolean>(false);

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

  const renderCategoryList = (categoryList: string[]) =>
    categoryList.map(
      (category: React.ReactNode, index: string | number | undefined) => (
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
      )
    );

  return (
    <Drawer
      classes={{ paper: classes.drawerStyles }}
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      <img className={classes.avatar} alt="Butterfly remote" src={logo}></img>
      <List>
        <ListItem
          button
          onClick={() => setDrawerOpen(false)}
          onKeyDown={() => setDrawerOpen(false)}
        >
          <ListItemIcon>
            <WorkIcon />
          </ListItemIcon>
          <ListItemText primary="Post a Job" />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => setDrawerOpen(false)}
          onKeyDown={() => setDrawerOpen(false)}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem
          button
          onClick={() => setDrawerOpen(false)}
          onKeyDown={() => setDrawerOpen(false)}
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
  avatar: {
    margin: theme.spacing(3),
    width: 180,
    height: "auto"
  },
  nested: {
    paddingLeft: theme.spacing(4)
  },
  drawerStyles: {
    background:
      "linear-gradient(0deg, rgba(255,255,255,1) 88%, rgba(255,209,246,1) 99%, rgba(255,0,204,1) 100%)"
  }
}));

export default MenuDrawer;
