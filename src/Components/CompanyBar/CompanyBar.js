import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import "./CompanyBar.css";

import backgroundImage from "../../images/background.png";
import { Typography, Grid, Fab } from "@material-ui/core";

const CompanyBar = () => {
  const classes = useStyles();

  return (
    <Grid
      container
      id="companyBar"
      justify="space-between"
      alignContent="center"
    >
      <Grid item xs={10} sm={4} className={classes.innerBox}>
        <Grid container direction="column">
          <Grid item>
            <Typography variant="h5">BUTTERFLY</Typography>
            <Typography variant="h6">Your Freedom Starts Here!</Typography>
            <Typography variant="caption">
              Work from anywhere for the best companies in the world.
            </Typography>
          </Grid>
          <Grid item>
            <Fab
              onClick={() => console.log("Post a Job")}
              color="primary"
              variant="extended"
              size="medium"
              aria-label="postJob"
              className={classes.postJobButton}
            >
              Post a Job
            </Fab>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  root: {},
  innerBox: {
    margin: theme.spacing(6)
  },
  postJobButton: {
    marginTop: theme.spacing(3),
    background: "linear-gradient(to bottom, #ff00cc, #333399)"
  }
}));

export default CompanyBar;
