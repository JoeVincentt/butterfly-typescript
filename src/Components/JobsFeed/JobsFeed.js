import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import firebase from "firebase/app";
import "firebase/firestore";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ExpandMoreOutlinedIcon from "@material-ui/icons/ExpandMoreOutlined";
import { makeStyles } from "@material-ui/core/styles";
import {
  LinearProgress,
  Button,
  Box,
  CircularProgress
} from "@material-ui/core";
import { renderJobsFeed } from "./utils/renderJobsFeed";

const JobsFeed = ({ jobs, history }) => {
  const classes = useStyles();
  const db = firebase.firestore();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [loadingMoreJobs, setLoadingMoreJobs] = useState(true);
  const [recentJobs, setRecentJobs] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);

  useEffect(() => {
    getRecentJobs();
    getFeaturedJobs();
  }, []);

  const getFeaturedJobs = () => {
    let jobs = [];
    db.collection("jobs")
      .where("advertisementPlan", "==", "High")
      // .orderBy("date", "desc")
      .limit(10)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          jobs.push(doc.data());
        });
      })
      .then(() => {
        setFeaturedJobs(jobs);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        enqueueSnackbar("Oops! Something went wrong! Please try again.", {
          variant: "error"
        });
      });
  };
  const getRecentJobs = () => {
    let sevenDaysFromNow = Date.now() - 604800000;
    let jobs = [];
    db.collection("jobs")
      .where("date", ">=", sevenDaysFromNow)
      .orderBy("date", "desc")
      .limit(10)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          jobs.push(doc.data());
        });
      })
      .then(() => {
        setRecentJobs(jobs);
        // console.log(jobs);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        enqueueSnackbar("Oops! Something went wrong! Please try again.", {
          variant: "error"
        });
      });
  };

  const navigateToJobDetails = id => {
    history.push({
      pathname: `/job-description/${id}`,
      state: {
        id
      }
    });
  };

  const renderSeeMoreButton = (handleLoad, loading) => {
    if (loading) {
      return (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      );
    } else {
      return (
        <Box textAlign="center">
          <Button
            color="primary"
            className={classes.button}
            size="large"
            endIcon={<ExpandMoreOutlinedIcon />}
            onClick={() => handleLoad()}
          >
            see more
          </Button>
        </Box>
      );
    }
  };

  if (loading) {
    return <LinearProgress />;
  } else {
    return (
      <Grid container spacing={1} justify="center">
        <Grid item xs={12} className={classes.categoryBox}>
          <Grid
            container
            justify="center"
            alignContent="center"
            className={classes.titleBox}
          >
            <Typography variant="h5" className={classes.categoryText}>
              Featured
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {renderJobsFeed(featuredJobs, navigateToJobDetails)}
          {renderSeeMoreButton()}
        </Grid>
        <Grid item xs={12} className={classes.categoryBox}>
          <Grid
            container
            justify="center"
            alignContent="center"
            className={classes.titleBox}
          >
            <Typography variant="h5" className={classes.categoryText}>
              Recently Posted
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {renderJobsFeed(recentJobs, navigateToJobDetails)}
        </Grid>
      </Grid>
    );
  }
};

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  categoryBox: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(3)
  },
  categoryText: {
    border: "1px solid rgba(107, 19, 107, 0.2)",
    borderRadius: "2px",
    padding: theme.spacing(2)
  },
  titleBox: {
    marginTop: theme.spacing(14)
  }
}));

export default withRouter(JobsFeed);
