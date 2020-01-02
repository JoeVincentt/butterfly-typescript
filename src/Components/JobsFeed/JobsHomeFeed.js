import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import firebase from "firebase/app";
import "firebase/firestore";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { LinearProgress, Grid, Typography } from "@material-ui/core";

import { renderJobsFeed } from "./utils/renderJobsFeed";
import SeeMoreButton from "../Buttons/SeeMoreButton";

const JobsFeed = ({ jobs, history }) => {
  const classes = useStyles();
  const db = firebase.firestore();

  const { enqueueSnackbar } = useSnackbar();

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

  const getFeaturedJobs = async () => {
    let jobs = [];
    try {
      const querySnapshot = await db
        .collection("jobs")
        .where("advertisementPlan", "==", "Marathon")
        .where("status", "==", "active")
        .orderBy("date", "desc")
        .limit(5)
        .get();
      var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisibleFeaturedJob(lastVisible);
      await querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        jobs.push(doc.data());
      });
      setFeaturedJobs(jobs);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Oops! Something went wrong! Please try again.", {
        variant: "error"
      });
    }
  };

  const loadMoreFeaturedJobs = async () => {
    setLoadingMoreFeaturedJobs(true);
    let jobs = [...featuredJobs];

    try {
      const querySnapshot = await db
        .collection("jobs")
        .where("advertisementPlan", "==", "Marathon")
        .where("status", "==", "active")
        .orderBy("date", "desc")
        .startAfter(lastVisibleFeaturedJob)
        .limit(5)
        .get();
      var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisibleFeaturedJob(lastVisible);
      if (lastVisible === undefined) {
        setNoMoreJobsInFeaturedCategory(true);
      }
      await querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        jobs.push(doc.data());
      });
      setFeaturedJobs(jobs);
      setLoadingMoreFeaturedJobs(false);
    } catch (error) {
      setLoadingMoreFeaturedJobs(false);
      enqueueSnackbar("Oops! Something went wrong! Please try again.", {
        variant: "error"
      });
    }
  };

  const getRecentJobs = async () => {
    let sevenDaysFromNow = Date.now() - 604800000;
    let jobs = [];
    try {
      const querySnapshot = await db
        .collection("jobs")
        .where("date", ">=", sevenDaysFromNow)
        .where("status", "==", "active")
        .orderBy("date", "desc")
        .limit(5)
        .get();
      var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisibleRecentJob(lastVisible);
      await querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        jobs.push(doc.data());
      });
      setRecentJobs(jobs);
      setLoadingMoreRecentJobs(false);
    } catch (error) {
      setLoadingMoreRecentJobs(false);
      enqueueSnackbar("Oops! Something went wrong! Please try again.", {
        variant: "error"
      });
    }
  };

  const loadMoreRecentJobs = async () => {
    setLoadingMoreRecentJobs(true);
    let sevenDaysFromNow = Date.now() - 604800000;
    let jobs = [...recentJobs];

    try {
      const querySnapshot = await db
        .collection("jobs")
        .where("date", ">=", sevenDaysFromNow)
        .where("status", "==", "active")
        .orderBy("date", "desc")
        .startAfter(lastVisibleRecentJob)
        .limit(5)
        .get();
      var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisibleRecentJob(lastVisible);
      if (lastVisible === undefined) {
        setNoMoreJobsInRecentCategory(true);
      }
      await querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        jobs.push(doc.data());
      });
      setRecentJobs(jobs);
      setLoadingMoreRecentJobs(false);
    } catch (error) {
      setLoadingMoreRecentJobs(false);
      enqueueSnackbar("Oops! Something went wrong! Please try again.", {
        variant: "error"
      });
    }
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
      <React.Fragment>
        <Helmet>
          <title>Butterfly Remote</title>
        </Helmet>
        <Grid container justify="space-around">
          <Grid item xs={12} sm={10} md={5}>
            <Grid item xs={12} className={classes.categoryBox}>
              <Grid
                container
                justify="center"
                alignContent="center"
                className={classes.titleBox}
              >
                <Typography variant="h4" className={classes.categoryText}>
                  Featured
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {renderJobsFeed(
                featuredJobs,
                navigateToJobDetails,
                "No job postings in this category available. Please check again later."
              )}
              {featuredJobs.length > 0 && (
                <SeeMoreButton
                  handleLoad={() => loadMoreFeaturedJobs()}
                  loading={loadingMoreFeaturedJobs}
                  noMoreJobs={noMoreJobsInFeaturedCategory}
                  text="no more featured jobs"
                />
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={10} md={5}>
            <Grid item xs={12} className={classes.categoryBox}>
              <Grid
                container
                justify="center"
                alignContent="center"
                className={classes.titleBox}
              >
                <Typography variant="h4" className={classes.categoryText}>
                  Recently Posted
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {renderJobsFeed(
                recentJobs,
                navigateToJobDetails,
                "No job postings in this category available. Please check again later."
              )}
              {recentJobs.length > 0 && (
                <SeeMoreButton
                  handleLoad={() => loadMoreRecentJobs()}
                  loading={loadingMoreRecentJobs}
                  noMoreJobs={noMoreJobsInRecentCategory}
                  text="no more recent jobs"
                />
              )}
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
};

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  categoryBox: {},
  categoryText: {},
  titleBox: {
    marginTop: theme.spacing(2)
  }
}));

export default withRouter(JobsFeed);
