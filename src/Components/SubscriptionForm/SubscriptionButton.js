import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";
import MailOutlineIcon from "@material-ui/icons/MailOutline";

const SubscriptionButton = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Fab color="primary" aria-label="add">
        <MailOutlineIcon fontSize="large" />
      </Fab>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  root: {}
}));

export default SubscriptionButton;
