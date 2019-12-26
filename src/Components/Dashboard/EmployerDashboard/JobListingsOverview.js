import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Helmet } from "react-helmet";
import firebase from "firebase/app";
import "firebase/firestore";
import {
  Grid,
  Typography,
  Paper,
  Divider,
  Button,
  LinearProgress,
  Box
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Brightness1Icon from "@material-ui/icons/Brightness1";

import SeeMoreButton from "../../Buttons/SeeMoreButton";
import { UserStateContext } from "../../../StateManagement/UserState";
import defaultLogo from "../../../images/defaultLogo.jpg";

const JobListingOverview = ({ history }) => {
  const classes = useStyles();
  const db = firebase.firestore();
  const { enqueueSnackbar } = useSnackbar();
  const state = useContext(UserStateContext);

  const [loading, setLoading] = useState(true);

  //Jobs State
  const [loadingMoreJobs, setLoadingMoreJobs] = useState(false);
  const [lastVisibleJob, setLastVisibleJob] = useState(null);
  const [noMoreJobs, setNoMoreJobs] = useState(false);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getJobs();
  }, []);

  const getJobs = async () => {
    let jobsDraft = [];
    try {
      const querySnapshot = await db
        .collection("jobStats")
        .doc(state.uid)
        .collection("jobStats")
        .orderBy("status", "asc")
        .orderBy("title", "asc")
        .limit(5)
        .get();
      var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisibleJob(lastVisible);
      await querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        jobsDraft.push(doc.data());
      });
      setJobs(jobsDraft);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // console.log("Error getting documents: ", error);
      enqueueSnackbar("Oops! Something went wrong! Please try again.", {
        variant: "error"
      });
    }
  };

  const loadMoreJobs = async () => {
    setLoadingMoreJobs(true);
    let jobsDraft = [...jobs];
    try {
      const querySnapshot = await db
        .collection("jobStats")
        .doc(state.uid)
        .collection("jobStats")
        .orderBy("status", "asc")
        .orderBy("title", "asc")
        .startAfter(lastVisibleJob)
        .limit(5)
        .get();
      var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisibleJob(lastVisible);
      if (lastVisible === undefined) {
        setNoMoreJobs(true);
      }
      await querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        jobsDraft.push(doc.data());
      });
      setJobs(jobsDraft);
      setLoadingMoreJobs(false);
    } catch (error) {
      setLoadingMoreJobs(false);
      enqueueSnackbar("Oops! Something went wrong! Please try again.", {
        variant: "error"
      });
    }
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

  const renderJobOverview = (id, logo, title, views, applied, status) => (
    <Paper className={classes.rootPaper}>
      <Grid container direction="column" spacing={2}>
        <Grid item style={{ marginBottom: -30 }}>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            <Brightness1Icon
              className={
                status === "active"
                  ? classes.activityIconActive
                  : classes.activityIconExpired
              }
            />
            <Typography variant="caption" className={classes.activityText}>
              {status}
            </Typography>
          </Grid>
        </Grid>

        <Grid item>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="flex-start"
            spacing={2}
          >
            <Grid item xs={2} sm={1} md={2} xl={1}>
              <img
                src={logo.length <= 0 ? defaultLogo : logo}
                alt="logo"
                style={{ height: 60, width: 60, marginTop: 8 }}
              />
            </Grid>
            <Grid item xs={10} sm={11} md={10} xl={11}>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="flex-end"
                style={{ marginTop: 20, marginLeft: 10 }}
              >
                <Typography variant="h6">{title}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
        <Grid item>
          <Grid container direction="row" spacing={1} alignItems="center">
            <Grid item xs={6} sm={6}>
              <Paper elevation={0} className={classes.itemPaper}>
                <Grid container direction="row" spacing={1}>
                  <Grid item>
                    <Grid
                      container
                      justify="center"
                      alignItems="center"
                      className={classes.viewsIconBox}
                    >
                      <VisibilityOutlinedIcon className={classes.viewsIcon} />
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container direction="column">
                      <Typography variant="h3">{views}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Views
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Paper elevation={0} className={classes.itemPaper}>
                <Grid container direction="row" spacing={1}>
                  <Grid item>
                    <Grid
                      container
                      justify="center"
                      alignItems="center"
                      className={classes.appliedIconBox}
                    >
                      <PeopleOutlineIcon className={classes.appliedIcon} />
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container direction="column">
                      <Typography variant="h3">{applied}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Applied
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid container direction="row" justify="space-between">
          <Grid item>
            <Grid container justify="flex-start">
              <Button
                color="primary"
                className={classes.button}
                size="large"
                // endIcon={<ArrowForwardIcon />}
                onClick={() => {
                  // console.log(id);
                  history.push(`/dashboard-employer/applicants-list/${id}`);
                }}
              >
                Applicants
              </Button>
            </Grid>
          </Grid>

          <Grid item>
            <Grid container justify="flex-end">
              <Button
                color="primary"
                className={classes.button}
                size="large"
                onClick={() => navigateToJobDetails(id)}
              >
                Open
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );

  if (loading) {
    return <LinearProgress />;
  } else {
    return (
      <React.Fragment>
        <Helmet>
          <title>Job Listings Overview</title>
        </Helmet>
        <div className={classes.root}>
          <Grid container justify="space-between">
            <Button
              color="primary"
              className={classes.button}
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={() => history.push("/dashboard-overview")}
            >
              Dashboard Overview
            </Button>
          </Grid>
          {jobs.length <= 0 && (
            <Box textAlign="center">
              <Typography variant="body1" color="textSecondary">
                You did not post any jobs yet.
              </Typography>
            </Box>
          )}
          <Grid container justify="center" alignContent="center">
            {jobs.map((job, index) => (
              <Grid
                key={job.id}
                item
                xs={12}
                md={4}
                lg={3}
                xl={3}
                className={classes.paperBox}
              >
                {renderJobOverview(
                  job.id,
                  job.logo,
                  job.title,
                  job.views,
                  job.applied,
                  job.status
                )}
              </Grid>
            ))}
          </Grid>
          {jobs.length > 0 && (
            <SeeMoreButton
              handleLoad={() => loadMoreJobs()}
              loading={loadingMoreJobs}
              noMoreJobs={noMoreJobs}
              text={"No More Job Postings"}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "auto",
    // marginTop: theme.spacing(3),
    flexGrow: 1,
    // overflow: "scroll"
    margin: theme.spacing(1)
  },
  paperBox: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  rootPaper: {
    padding: theme.spacing(2)
  },
  itemPaper: {
    padding: theme.spacing(2),
    border: "1px solid rgba(107, 19, 107, 0.2)"
  },
  activityIconActive: {
    marginBottom: 2,
    marginRight: 2,
    color: "green",
    fontSize: 9
  },
  activityIconExpired: {
    marginBottom: 2,
    marginRight: 2,
    color: "red",
    fontSize: 9
  },
  activityText: {
    textTransform: "capitalize"
  },
  appliedIconBox: {
    backgroundColor: "rgba(48, 74, 241, 0.3)",
    padding: 10,
    borderRadius: "50%",
    marginTop: 5
  },
  appliedIcon: {
    color: "rgb(35, 62, 239)"
  },
  viewsIconBox: {
    backgroundColor: "rgba(62, 239, 35, 0.3)",
    padding: 10,
    borderRadius: "50%",
    marginTop: 5
  },
  viewsIcon: {
    color: "rgb(44, 217, 17)"
  },
  button: {
    margin: theme.spacing(1)
  }
}));

export default withRouter(JobListingOverview);
