import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { Helmet } from "react-helmet";
import firebase from "firebase/app";
import "firebase/firestore";
import { withRouter } from "react-router-dom";
import { LinearProgress, Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { transformTextCapitalize } from "../../utils/transformTextCapitalize";
import { renderJobsFeed } from "../utils/renderJobsFeed";
import SeeMoreButton from "../../Buttons/SeeMoreButton";

const JobsFeed = ({ history, location, match }) => {
  const classes = useStyles();
  const db = firebase.firestore();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  //Featured Jobs State
  const [loadingMoreInCategoryJobs, setLoadingMoreInCategoryJobs] = useState(
    false
  );
  const [lastVisibleInCategoryJob, setLastVisibleInCategoryJob] = useState(
    null
  );
  const [
    noMoreJobsInCategoryCategory,
    setNoMoreJobsInCategoryCategory
  ] = useState(false);
  const [inCategoryJobs, setInCategoryJobs] = useState([]);

  useEffect(() => {
    transformTextCapitalize("marketing & something");
    // this.props.location.state
    // console.log(location);
    // console.log(props.match.params.categoryID);
    // getRecentJobs();
    getJobs();
  }, [match.params.categoryID]);

  const getJobs = () => {
    let jobs = [];
    db.collection("jobs")
      .where("category", "==", match.params.categoryID)
      .where("status", "==", "active")
      .limit(10)
      .get()
      .then(querySnapshot => {
        var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisibleInCategoryJob(lastVisible);
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          jobs.push(doc.data());
        });
      })
      .then(() => {
        setInCategoryJobs(jobs);
        // console.log(jobs);
        setLoading(false);
      })
      .catch(error => {
        // console.log(error);
        setLoading(false);
        enqueueSnackbar("Oops! Something went wrong! Please try again.", {
          variant: "error"
        });
        // console.log("Error getting documents: ", error);
      });
  };

  const loadMoreInCategoryJobs = () => {
    setLoadingMoreInCategoryJobs(true);
    let jobs = [...inCategoryJobs];
    db.collection("jobs")
      .where("category", "==", match.params.categoryID)
      .where("status", "==", "active")
      .startAfter(lastVisibleInCategoryJob)
      .limit(10)
      .get()
      .then(querySnapshot => {
        var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisibleInCategoryJob(lastVisible);
        if (lastVisible === undefined) {
          setNoMoreJobsInCategoryCategory(true);
        }
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          jobs.push(doc.data());
        });
      })
      .then(() => {
        setInCategoryJobs(jobs);
        setLoadingMoreInCategoryJobs(false);
      })
      .catch(error => {
        setLoadingMoreInCategoryJobs(false);
        enqueueSnackbar("Oops! Something went wrong! Please try again.", {
          variant: "error"
        });
      });
  };

  const navigateToJobDetails = id => {
    // console.log(history);
    // console.log(id);
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
          <title>{transformTextCapitalize(match.params.categoryID)}</title>
        </Helmet>
        <Grid container justify="center">
          <Grid item xs={12} className={classes.categoryBox}>
            <Grid container justify="center" alignContent="center">
              <Typography variant="h4" className={classes.categoryText}>
                {match.params.categoryID}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
            {renderJobsFeed(
              inCategoryJobs,
              navigateToJobDetails,
              "No job postings in this category available. Please check again later."
            )}
            {inCategoryJobs.length > 0 && (
              <SeeMoreButton
                handleLoad={() => loadMoreInCategoryJobs()}
                loading={loadingMoreInCategoryJobs}
                noMoreJobs={noMoreJobsInCategoryCategory}
                text={`no more ${match.params.categoryID} jobs`}
              />
            )}
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
  categoryBox: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(3)
  },
  categoryText: {
    // border: "1px solid rgba(107, 19, 107, 0.2)",
    // borderRadius: "2px",
    // boxShadow: "0px 0px 4px -1px rgba(107,19,107,1)",
    textTransform: "capitalize",
    padding: theme.spacing(2)
  }
}));

export default withRouter(JobsFeed);
