import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Grid, Paper, Button } from "@material-ui/core";
import BusinessIcon from "@material-ui/icons/Business";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import defaultLogo from "../../../images/defaultLogo.jpg";
import colors from "../../../constants/colors";

const CompanyInfoCard = ({
  logo,
  companyName,
  companyLocation,
  companyWebsite,
  companyAbout
}) => {
  const classes = useStyles();

  const renderCompanyProfilePicture = () => (
    <Grid container direction="column" justify="center" alignContent="center">
      <img
        alt="company logo"
        src={logo.length <= 0 ? defaultLogo : logo}
        className={classes.bigAvatar}
      />
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
        <Grid container direction="row" justify="center" alignItems="flex-end">
          <Grid item>
            <BusinessIcon className={classes.icon} />
          </Grid>
          <Grid item>
            <Typography variant="body1">{companyName}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container direction="row" justify="center" alignItems="flex-end">
          <Grid item>
            <LocationOnIcon className={classes.icon} />
          </Grid>
          <Grid item>
            <Typography variant="body1">{companyLocation}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={11}>
        <Typography variant="body1">{companyAbout}</Typography>
      </Grid>
      {companyWebsite !== null && companyWebsite !== "" && (
        <Grid item>
          <Grid container justify="center">
            <a
              href={companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <Button color="primary">Visit Website</Button>
            </a>
          </Grid>
        </Grid>
      )}
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
        {/* <Grid item xs={12}>
          {renderCardTitleText()}
        </Grid> */}
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
    border: "1px solid rgba(107, 19, 107, 0.2)",
    "@media (max-width: 650px)": {
      padding: theme.spacing(2),
      margin: theme.spacing(0),
      marginBottom: theme.spacing(2)
    }
  },
  bigAvatar: {
    margin: theme.spacing(3),
    // boxShadow: "0px 0px 9px -1px rgba(107,19,107,1)",
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
