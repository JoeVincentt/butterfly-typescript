import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import Paper from "@material-ui/core/Paper";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import BusinessIcon from "@material-ui/icons/Business";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import Hidden from "@material-ui/core/Hidden";
import withWidth from "@material-ui/core/withWidth";

import { UserStateContext } from "../../StateManagement/UserState";

import ApplicationDialog from "../Application/ApplicationDialog";
import GradientButton from "../Buttons/GradientButton";
import colors from "../../constants/colors";
// import "./Style/Card.css";

const JobCard = ({
  id,
  title,
  companyLocation,
  companyName,
  logo,
  date,
  navigateToJobDetails
}) => {
  const classes = useStyles();
  const state = useContext(UserStateContext);
  const { isLoggedIn } = state;

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const renderLogoImage = () => (
    <Grid item xs={6} sm={2}>
      <img alt="Company Logo" src={logo} className={classes.bigAvatar} />
    </Grid>
  );

  const renderJobTitle = () => (
    <Grid
      item
      xs={10}
      className={classes.jobTitle}
      onClick={() => navigateToJobDetails(id)}
    >
      <Typography variant="h6">{title}</Typography>
    </Grid>
  );

  const renderTimePostedSmallScreen = () => (
    <Hidden smUp>
      <Grid item xs={6}>
        <Grid container direction="row" justify="flex-end" alignItems="center">
          <AccessTimeIcon className={classes.icon} />
          <Typography variant="subtitle2" style={{ color: "#616161" }}>
            {date}
          </Typography>
        </Grid>
      </Grid>
    </Hidden>
  );

  const renderTimePostedMediumAndUpScreen = () => (
    <Hidden xsDown>
      <Grid item xs={2}>
        <Grid container direction="row" justify="flex-end" alignItems="center">
          <AccessTimeIcon className={classes.icon} />
          <Typography variant="subtitle2" style={{ color: "#616161" }}>
            {date}
          </Typography>
        </Grid>
      </Grid>
    </Hidden>
  );

  const renderCompanyDetails = () => (
    <Grid
      spacing={1}
      container
      direction="row"
      justify="flex-start"
      alignItems="flex-end"
    >
      <Grid item>
        <Grid container direction="row" alignItems="flex-end">
          <Grid item>
            <BusinessIcon className={classes.icon} />
          </Grid>
          <Grid item>
            <Typography variant="body1" color="textSecondary">
              {companyName}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row" alignItems="flex-end">
          <Grid item>
            <LocationOnIcon className={classes.icon} />
          </Grid>
          <Grid item>
            <Typography variant="body1" color="textSecondary">
              {companyLocation}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const renderCardButtons = () => (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      className={classes.buttonRow}
    >
      <Grid item>
        <Fab
          size="small"
          variant="extended"
          aria-label="details"
          className={classes.detailsButton}
          onClick={() => {
            navigateToJobDetails(id);
          }}
        >
          Details
        </Fab>
      </Grid>
      <Grid item>
        <GradientButton
          onClick={() => handleClickOpen()}
          text="apply"
          size="small"
          labelName="apply"
        />
      </Grid>
    </Grid>
  );

  return (
    <Grid container justify="center">
      <Grid item xs={12} sm={12} md={10}>
        <Paper id="job-card" className={classes.paper} elevation={0}>
          <Grid container spacing={1}>
            <Grid container>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
              >
                {renderLogoImage()}
                {renderTimePostedSmallScreen()}
                <Grid item xs>
                  <Grid container>
                    <Grid item xs>
                      <Grid item>
                        <Grid
                          container
                          justify="space-between"
                          alignItems="center"
                        >
                          {renderJobTitle()}
                          {renderTimePostedMediumAndUpScreen()}
                        </Grid>
                      </Grid>
                      <Grid item xs={12} sm={10} md={10}>
                        {renderCompanyDetails()}
                      </Grid>
                      <Grid item xs={12}>
                        {renderCardButtons()}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      {/* Application Dialog */}
      <ApplicationDialog
        open={open}
        handleClose={handleClose}
        title={title}
        id={id}
      />
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(1, 2),
    margin: theme.spacing(1),
    border: "1px solid rgba(107, 19, 107, 0.2)",
    "@media (max-width: 750px)": {
      padding: theme.spacing(2),
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(0)
    },
    "&:hover": {
      boxShadow: "inset 10px 0px 3px -4px rgba(204,4,204,1)"
    }
  },
  jobTitle: {
    cursor: "pointer"
  },
  bigAvatar: {
    margin: theme.spacing(3),
    marginLeft: theme.spacing(1),
    width: 100,
    height: 100,
    // boxShadow: "0px 0px 9px -1px rgba(107,19,107,1)",

    "@media (max-width: 750px)": {
      marginTop: "-30px",
      margin: theme.spacing(0),
      width: 60,
      height: 60
    }
  },
  icon: {
    marginRight: 2,
    fontSize: "1.1rem",
    color: colors.darkGrey
  },
  cardInfoBody: {
    marginBottom: theme.spacing(2),
    cursor: "pointer"
  },
  margin: {
    marginBottom: theme.spacing(2)
  },
  buttonRow: {
    marginTop: theme.spacing(1)
  },
  detailsButton: {
    marginRight: theme.spacing(1),
    marginRight: 0,
    color: colors.purple,
    backgroundColor: colors.grey
  },
  applyButton: {
    margin: theme.spacing(1)
  }
}));

JobCard.propTypes = {
  width: PropTypes.oneOf(["lg", "md", "sm", "xl", "xs"]).isRequired
};

export default withWidth()(JobCard);
