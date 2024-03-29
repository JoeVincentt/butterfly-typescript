import React, { useContext } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Button,
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  Typography
} from "@material-ui/core";

import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import { UserStateContext } from "../../StateManagement/UserState";

import ApplicationForm from "./ApplicationForm/ApplicationForm";
import GradientButton from "../Buttons/GradientButton";

const ApplicationDialog = ({
  open,
  handleClose,
  title,
  history,
  id,
  postedBy,
  companyName
}) => {
  const { isLoggedIn } = useContext(UserStateContext);

  const renderContent = () => {
    if (isLoggedIn) {
      return (
        <ApplicationForm
          jobTitle={title}
          jobID={id}
          postedBy={postedBy}
          companyName={companyName}
          handleClose={handleClose}
        />
      );
    } else {
      return (
        <Grid
          container
          justify="center"
          alignItems="center"
          alignContent="center"
        >
          <GradientButton
            text="sign in to apply"
            labelName="login-to-apply"
            size="large"
            onClick={() => history.push("/sign-in")}
          />
        </Grid>
      );
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle id="customized-dialog-title">Apply for {title}</DialogTitle>
      <DialogContent dividers>{renderContent()}</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

export default withRouter(ApplicationDialog);
