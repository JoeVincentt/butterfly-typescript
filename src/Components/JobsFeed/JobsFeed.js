import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import firebase from "firebase/app";
import "firebase/firestore";
import { withRouter } from "react-router-dom";
import { convertTimestamp } from "../utils/convertTimestamp";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import JobCard from "../JobCard/JobCard";
import { LinearProgress } from "@material-ui/core";

const JobsFeed = ({ jobs, history }) => {
  const classes = useStyles();
  const db = firebase.firestore();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
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

  const renderJobsFeed = jobs => {
    if (jobs.length !== 0) {
      return jobs.map(
        (
          {
            id,
            title,
            postedBy,
            companyLocation,
            companyName,
            logo,
            date,
            advertisementPlan
          },
          index
        ) => (
          <JobCard
            key={id}
            id={id}
            postedBy={postedBy}
            title={title}
            companyLocation={companyLocation}
            companyName={companyName}
            logo={logo}
            advertisementPlan={advertisementPlan}
            date={convertTimestamp(date)}
            navigateToJobDetails={() => navigateToJobDetails(id)}
          />
        )
      );
    } else {
      return (
        <Grid container justify="center">
          <Typography variant="body1" color="textSecondary">
            No job postings in this category available. Please check again
            later.
          </Typography>
        </Grid>
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
          {renderJobsFeed(featuredJobs)}
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
          {renderJobsFeed(recentJobs)}
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
