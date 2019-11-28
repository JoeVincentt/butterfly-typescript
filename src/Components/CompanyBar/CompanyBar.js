import React from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import "./CompanyBar.css";

import backgroundImage from "../../images/companybar_background.jpeg";
import { Typography, Grid, Fab } from "@material-ui/core";

import GradientButton from "../Buttons/GradientButton";

const CompanyBar = ({ history }) => {
  const classes = useStyles();

  const navigateTo = path => history.push(`/${path}`);

  return (
    <Grid
      container
      id="companyBar"
      justify="space-between"
      alignContent="center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Grid item xs={12} sm={6} md={4} className={classes.innerBox}>
        <Grid container direction="column">
          <Grid item>
            <Typography variant="h3">BUTTERFLY</Typography>
            <Typography variant="h6">Your Freedom Starts Here!</Typography>
            <Typography variant="caption">
              Work from anywhere for the best companies in the world.
            </Typography>
          </Grid>
          <Grid item className={classes.postJobButton}>
            <GradientButton
              onClick={() => navigateTo("post-a-job")}
              size="medium"
              labelName="postAJob"
              text="Post a Job"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  root: {},
  innerBox: {
    margin: theme.spacing(6),
    marginLeft: theme.spacing(20),
    "@media (max-width: 650px)": {
      marginLeft: theme.spacing(6)
    }
  },
  postJobButton: {
    marginTop: theme.spacing(3)
  }
}));

export default withRouter(CompanyBar);
