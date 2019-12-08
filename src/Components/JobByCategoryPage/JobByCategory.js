import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { withRouter } from "react-router-dom";
import { convertTimestamp } from "../utils/convertTimestamp";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import JobCard from "../JobCard/JobCard";
import ButterflyLoader from "../Loader/ButterflyLoader";

const JobsFeed = ({ history, location }) => {
  const classes = useStyles();
  const db = firebase.firestore();
  const [loading, setLoading] = useState(true);
  const [jobsInCategory, setJobs] = useState([]);

  useEffect(() => {
    // this.props.location.state
    // console.log(location);
    // getRecentJobs();
    getJobs();
  }, [location]);

  const getJobs = () => {
    let jobs = [];
    db.collection("jobs")
      .where("category", "==", location.state.categoryID)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          jobs.push(doc.data());
        });
      })
      .then(() => {
        setJobs(jobs);
        // console.log(jobs);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        // console.log("Error getting documents: ", error);
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
    }
  };

  if (loading) {
    return <ButterflyLoader />;
  } else {
    return (
      <Grid container spacing={1} justify="center">
        <Grid item xs={4} className={classes.categoryBox}>
          <Grid container justify="center" alignContent="center">
            <Typography variant="h5" className={classes.categoryText}>
              {location.state.category}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {renderJobsFeed(jobsInCategory)}
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
    boxShadow: "0px 0px 4px -1px rgba(107,19,107,1)",
    padding: theme.spacing(2)
  }
}));

export default withRouter(JobsFeed);
