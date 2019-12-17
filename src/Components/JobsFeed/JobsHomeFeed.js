import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import firebase from "firebase/app";
import "firebase/firestore";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { LinearProgress } from "@material-ui/core";
import { renderJobsFeed } from "./utils/renderJobsFeed";
import SeeMoreButton from "../Buttons/SeeMoreButton";

const JobsFeed = ({ jobs, history }) => {
  const classes = useStyles();
  const db = firebase.firestore();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);

  //Featured Jobs State
  const [loadingMoreFeaturedJobs, setLoadingMoreFeaturedJobs] = useState(false);
  const [lastVisibleFeaturedJob, setLastVisibleFeaturedJob] = useState(null);
  const [
    noMoreJobsInFeaturedCategory,
    setNoMoreJobsInFeaturedCategory
  ] = useState(false);
  const [featuredJobs, setFeaturedJobs] = useState([]);

  //Recent Jobs State
  const [loadingMoreRecentJobs, setLoadingMoreRecentJobs] = useState(false);
  const [lastVisibleRecentJob, setLastVisibleRecentJob] = useState(null);
  const [noMoreJobsInRecentCategory, setNoMoreJobsInRecentCategory] = useState(
    false
  );
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    getRecentJobs();
    getFeaturedJobs();
  }, []);

  const getFeaturedJobs = () => {
    let jobs = [];
    db.collection("jobs")
      .where("advertisementPlan", "==", "High")
      .orderBy("date", "desc")
      .limit(5)
      .get()
      .then(querySnapshot => {
        var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisibleFeaturedJob(lastVisible);
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
        // console.log(error);
        setLoading(false);
        enqueueSnackbar("Oops! Something went wrong! Please try again.", {
          variant: "error"
        });
      });
  };

  const loadMoreFeaturedJobs = () => {
    setLoadingMoreFeaturedJobs(true);
    let jobs = [...featuredJobs];
    db.collection("jobs")
      .where("advertisementPlan", "==", "High")
      .orderBy("date", "desc")
      .startAfter(lastVisibleFeaturedJob)
      .limit(5)
      .get()
      .then(querySnapshot => {
        var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisibleFeaturedJob(lastVisible);
        if (lastVisible === undefined) {
          setNoMoreJobsInFeaturedCategory(true);
        }
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          jobs.push(doc.data());
        });
      })
      .then(() => {
        setFeaturedJobs(jobs);
        setLoadingMoreFeaturedJobs(false);
      })
      .catch(error => {
        setLoadingMoreFeaturedJobs(false);
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
      .limit(5)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(function(doc) {
          var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
          setLastVisibleRecentJob(lastVisible);
          // doc.data() is never undefined for query doc snapshots
          jobs.push(doc.data());
        });
      })
      .then(() => {
        setRecentJobs(jobs);
        // console.log(jobs);
        setLoadingMoreRecentJobs(false);
      })
      .catch(error => {
        setLoadingMoreRecentJobs(false);
        enqueueSnackbar("Oops! Something went wrong! Please try again.", {
          variant: "error"
        });
      });
  };

  const loadMoreRecentJobs = () => {
    setLoadingMoreRecentJobs(true);
    let sevenDaysFromNow = Date.now() - 604800000;
    let jobs = [...recentJobs];
    db.collection("jobs")
      .where("date", ">=", sevenDaysFromNow)
      .orderBy("date", "desc")
      .startAfter(lastVisibleRecentJob)
      .limit(5)
      .get()
      .then(querySnapshot => {
        var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisibleRecentJob(lastVisible);
        if (lastVisible === undefined) {
          setNoMoreJobsInRecentCategory(true);
        }
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          jobs.push(doc.data());
        });
      })
      .then(() => {
        setRecentJobs(jobs);
        setLoadingMoreRecentJobs(false);
      })
      .catch(error => {
        setLoadingMoreRecentJobs(false);
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
          <SeeMoreButton
            handleLoad={() => loadMoreFeaturedJobs()}
            loading={loadingMoreFeaturedJobs}
            noMoreJobs={noMoreJobsInFeaturedCategory}
          />
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
          <SeeMoreButton
            handleLoad={() => loadMoreRecentJobs()}
            loading={loadingMoreRecentJobs}
            noMoreJobs={noMoreJobsInRecentCategory}
          />
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
