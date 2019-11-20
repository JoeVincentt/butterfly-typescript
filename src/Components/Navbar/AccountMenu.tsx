import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import PersonIcon from "@material-ui/icons/Person";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

const AccountMenu: React.FC = () => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
        className={classes.accountIcon}
      >
        <PersonIcon className="account-icon" />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Dashboard</MenuItem>
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>Log Out</MenuItem>
      </Menu>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  accountIcon: {
    marginLeft: theme.spacing(2),
    boxShadow:
      "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)"
  }
}));

export default AccountMenu;
