import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
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
import { UserStateContext } from "../../../StateManagement/UserState";

const JobListingOverview = ({ history }) => {
  const classes = useStyles();
  const db = firebase.firestore();

  const state = useContext(UserStateContext);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let jobsDraft = [];
    db.collection("jobStats")
      .doc(state.uid)
      .collection("jobStats")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          jobsDraft.push(doc.data());
        });
      })
      .then(() => {
        // console.log(jobs);
        setJobs(jobsDraft);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.log("Error getting documents: ", error);
      });

    //     setLoading(false);
  }, []);

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

  const renderJobOverview = (id, logo, title, views, applied) => (
    <Paper className={classes.rootPaper}>
      <Grid container direction="column" spacing={4}>
        <Grid item>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="flex-start"
            spacing={2}
          >
            <Grid item xs={3}>
              <img
                src={logo}
                alt="logo"
                style={{ height: 60, width: 60, marginTop: 8 }}
              />
            </Grid>
            <Grid item xs={9}>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="flex-end"
              >
                <Typography variant="h6">{title}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider className={classes.divider} />
        <Grid item>
          <Grid container direction="row" spacing={1} alignItems="center">
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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

        <Grid item>
          <Grid container justify="flex-end">
            <Button
              color="primary"
              size="large"
              onClick={() => navigateToJobDetails(id)}
            >
              Open job Posting
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );

  if (loading) {
    return <LinearProgress />;
  } else {
    return (
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
          <Button
            color="primary"
            className={classes.button}
            size="large"
            // endIcon={<ArrowForwardIcon />}
            onClick={() => history.push("/dashboard-employer/applicants-list")}
          >
            go to Application
          </Button>
        </Grid>
        {jobs.length <= 0 && (
          <Box textAlign="center">
            <Typography variant="body1" color="textSecondary">
              You did not post any jobs yet.
            </Typography>
          </Box>
        )}
        <Grid container justify="flex-start" alignContent="center" spacing={3}>
          {jobs.map((job, index) => (
            <Grid key={job.id} item xs={12} md={3} className={classes.paperBox}>
              {renderJobOverview(
                job.id,
                job.logo,
                job.title,
                job.views,
                job.applied
              )}
            </Grid>
          ))}
        </Grid>
      </div>
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
    marginTop: theme.spacing(4)
  },
  rootPaper: {
    padding: theme.spacing(2)
  },
  divider: {
    marginLeft: 5,
    marginRight: 5
  },
  itemPaper: {
    padding: theme.spacing(2),
    border: "1px solid rgba(107, 19, 107, 0.2)"
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
  }
}));

export default withRouter(JobListingOverview);
