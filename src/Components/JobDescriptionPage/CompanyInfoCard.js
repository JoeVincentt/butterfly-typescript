import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Grid, Paper } from "@material-ui/core";
import BusinessIcon from "@material-ui/icons/Business";
import LocationOnIcon from "@material-ui/icons/LocationOn";

import GradientButton from "../Buttons/GradientButton";

import colors from "../../constants/colors";

const CompanyInfoCard = ({
  location,
  company,
  companyId,
  logoImage,
  altLogoText
}) => {
  const classes = useStyles();

  const renderCardTitleText = () => (
    <Grid container direction="column" justify="center" alignContent="center">
      <Typography variant="h6">Company Details</Typography>
    </Grid>
  );

  const renderCompanyProfilePicture = () => (
    <Grid container direction="column" justify="center" alignContent="center">
      <img alt={altLogoText} src={logoImage} className={classes.bigAvatar} />
    </Grid>
  );

  const renderCompanyDetails = () => (
    <Grid
      container
      spacing={2}
      direction="column"
      justify="center"
      alignContent="center"
    >
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
      <Grid item>
        <Grid container justify="center">
          <GradientButton
            text="See Profile"
            size="small"
            onClick={() => console.log("Company ID is", companyId)}
          />
        </Grid>
      </Grid>
    </Grid>
  );

  return (
    <Paper className={classes.paper}>
      <Grid
        container
        spacing={2}
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Grid item xs={12}>
          {renderCardTitleText()}
        </Grid>
        <Grid item xs={12}>
          {renderCompanyProfilePicture()}
        </Grid>
        <Grid item xs={12}>
          {renderCompanyDetails()}
        </Grid>
      </Grid>
    </Paper>
  );
};

const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(1),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    boxShadow: "none",
    border: "1px solid rgba(107, 19, 107, 0.2)"
  },
  bigAvatar: {
    margin: theme.spacing(3),
    boxShadow: "0px 0px 9px -1px rgba(107,19,107,1)",
    cursor: "pointer",
    width: 100,
    height: 100
  },

  icon: {
    marginRight: theme.spacing(1),
    fontSize: "1.1rem",
    color: colors.darkGrey
  }
}));

export default CompanyInfoCard;
