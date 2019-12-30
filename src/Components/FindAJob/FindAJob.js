import React, { Suspense } from "react";

import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { LinearProgress, Grid, Typography } from "@material-ui/core";

import Search from "./Search";

const JobsFeed = () => {
  const classes = useStyles();

  return (
    <Suspense fallback={<LinearProgress />}>
      <React.Fragment>
        <Helmet>
          <title>Find a Job</title>
        </Helmet>
        <Grid container justify="space-around">
          <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
            <Grid item xs={12} className={classes.categoryBox}>
              <Grid
                container
                justify="center"
                alignContent="center"
                className={classes.titleBox}
              >
                <Typography variant="h4" className={classes.categoryText}>
                  Quick Search
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.searchBox}>
              <Search />
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>{" "}
    </Suspense>
  );
};

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  categoryBox: {},
  categoryText: {},
  searchBox: {
    marginTop: theme.spacing(4)
  },
  titleBox: {
    marginTop: theme.spacing(2)
  }
}));

export default withRouter(JobsFeed);
