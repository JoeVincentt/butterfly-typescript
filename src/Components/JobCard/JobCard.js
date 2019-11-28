import React from "react";
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

import GradientButton from "../Buttons/GradientButton";

import colors from "../../constants/colors";

import "./Style/Card.css";

const JobCard = ({
  id,
  title,
  location,
  company,
  companyId,
  logoImage,
  altLogoText,
  date,
  navigateToJobDetails
}) => {
  const classes = useStyles();

  const renderLogoImage = () => (
    <Grid item xs={6} sm={2}>
      <img
        alt={altLogoText}
        src={logoImage}
        className={classes.bigAvatar}
        onClick={() => console.log("Company id is ", companyId)}
      />
    </Grid>
  );

  const renderJobTitle = () => (
    <Grid
      item
      xs={10}
      className={classes.jobTitle}
      onClick={() => console.log("Open job details ", id)}
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
    <Grid spacing={1} container direction="row" justify="flex-start">
      <Grid item>
        <Grid container direction="row">
          <Grid item>
            <BusinessIcon className={classes.icon} />
          </Grid>
          <Grid item>
            <Typography variant="body1" color="textSecondary">
              {company}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row">
          <Grid item>
            <LocationOnIcon className={classes.icon} />
          </Grid>
          <Grid item>
            <Typography variant="body1" color="textSecondary">
              {location}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const renderCardButtons = () => (
    <Grid container direction="row" justify="space-between">
      <GradientButton
        onClick={() => console.log("1-Click Apply", id)}
        text="1-Click Apply"
        size="small"
        labelName="1clickApply"
      />
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
      </Fab>{" "}
    </Grid>
  );

  return (
    <Grid container justify="center">
      <Grid item xs={12} sm={10} md={10}>
        <Paper id="job-card" className={classes.paper} elevation={0}>
          <Grid container spacing={1}>
            <Grid container>
              <Grid container direction="row" justify="space-between">
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
                      <Grid
                        item
                        xs={12}
                        sm={10}
                        md={10}
                        className={classes.margin}
                      >
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
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2, 2),
    margin: theme.spacing(1),
    border: "1px solid rgba(107, 19, 107, 0.2)"
  },
  jobTitle: {
    cursor: "pointer"
  },
  bigAvatar: {
    margin: theme.spacing(3),
    width: 60,
    height: 60,
    boxShadow: "0px 0px 9px -1px rgba(107,19,107,1)",
    cursor: "pointer"
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
  detailsButton: {
    margin: theme.spacing(1),
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
