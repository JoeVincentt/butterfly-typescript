import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Grid,
  Fab,
  Paper,
  Hidden,
  Grow,
  withWidth,
  Zoom
} from "@material-ui/core";

import AccessTimeIcon from "@material-ui/icons/AccessTime";
import BusinessIcon from "@material-ui/icons/Business";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import DateRangeIcon from "@material-ui/icons/DateRange";

import defaultLogo from "../../images/defaultLogo.jpg";
import { UserStateContext } from "../../StateManagement/UserState";

import ApplicationDialog from "../Application/ApplicationDialog";
import GradientButton from "../Buttons/GradientButton";
import colors from "../../constants/colors";

const JobCard = ({
  id,
  postedBy,
  title,
  companyLocation,
  companyName,
  logo,
  date,
  advertisementPlan,
  navigateToJobDetails,
  jobType
}) => {
  const classes = useStyles();
  const state = useContext(UserStateContext);
  const { isLoggedIn } = state;
  const [open, setOpen] = useState(false);
  const [growCard, setGrowCard] = useState(false);

  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    // console.log(id);
    // console.log(state.jobsApplied);
    setGrowCard(true);
    if (
      id !== null &&
      id !== undefined &&
      state.jobsApplied !== null &&
      state.jobsApplied !== undefined
    ) {
      const alreadyApplied = state.jobsApplied.includes(id);
      setAlreadyApplied(alreadyApplied);
    }

    return () => {};
  }, [id, state.jobsApplied]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const renderLogoImage = () => (
    <Grid item xs={6} sm={1} md={1} lg={1} xl={1}>
      <img
        alt="Company Logo"
        src={logo.length <= 0 ? defaultLogo : logo}
        className={classes.bigAvatar}
      />
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
      <Grid item xs={6} style={{ alignSelf: "flex-start" }}>
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
      <Grid item xs={2} style={{ alignSelf: "flex-start" }}>
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
      style={{ marginBottom: 20 }}
      spacing={1}
      container
      direction="row"
      justify="flex-start"
      alignItems="flex-end"
    >
      <Grid item>
        <Grid container direction="row" alignItems="flex-end">
          <Grid item>
            <DateRangeIcon className={classes.icon} />
          </Grid>
          <Grid item>
            <Typography variant="body1" color="textSecondary">
              {jobType}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
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
        {!alreadyApplied ? (
          <GradientButton
            onClick={() => !alreadyApplied && handleClickOpen()}
            text={alreadyApplied ? "applied" : "1-click apply"}
            size="small"
            labelName="apply"
          />
        ) : (
          <Typography variant="button" color="textSecondary">
            APPLIED
          </Typography>
        )}
      </Grid>
    </Grid>
  );

  return (
    <Grid container justify="center">
      <Zoom in={growCard} timeout={300}>
        <Grid item xs={12}>
          <Paper
            className={
              advertisementPlan === "Marathon"
                ? classes.paperHighAd
                : classes.paper
            }
            elevation={0}
          >
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
      </Zoom>
      {/* Application Dialog */}
      <ApplicationDialog
        open={open}
        handleClose={handleClose}
        title={title}
        id={id}
        postedBy={postedBy}
        companyName={companyName}
      />
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(1, 2),
    margin: theme.spacing(1),
    border: "1px solid rgba(107, 19, 107, 0.2)",

    padding: theme.spacing(2),
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(0),

    "&:hover": {
      backgroundColor: "ghostwhite"
    }
  },
  paperHighAd: {
    padding: theme.spacing(1, 2),
    margin: theme.spacing(1),
    border: "1px solid rgba(107, 19, 107, 0.2)",
    backgroundColor: "#faeef46b",

    padding: theme.spacing(2),
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(0),

    "&:hover": {
      backgroundColor: "ghostwhite"
    }
  },
  jobTitle: {
    cursor: "pointer"
  },
  bigAvatar: {
    margin: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 100,
    height: 100,
    // boxShadow: "0px 0px 9px -1px rgba(107,19,107,1)",
    "@media (max-width: 600px)": {
      marginTop: "-42px",
      margin: theme.spacing(0),
      width: 60,
      height: 60,
      borderRadius: "4px",
      border: "1px solid rgba(107, 19, 107, 0.2)",
      backgroundColor: "#fafafa",
      padding: 4
    },
    "@media (min-width: 600px)": {
      marginLeft: "-50px",
      margin: theme.spacing(0),
      width: 80,
      height: 80,
      borderRadius: "4px",
      border: "1px solid rgba(107, 19, 107, 0.2)",
      backgroundColor: "#fafafa",
      padding: 4
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
