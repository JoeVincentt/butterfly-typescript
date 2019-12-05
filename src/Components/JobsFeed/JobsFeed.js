import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import JobCard from "../JobCard/JobCard";
import ButterflyLoader from "../Loader/ButterflyLoader";

const JobsFeed = ({ jobs, history }) => {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    setLoading(false);
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

  const renderJobsFeed = jobs =>
    jobs.map(
      (
        { id, title, postedBy, companyLocation, companyName, logo, date },
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
          date={date}
          navigateToJobDetails={() => navigateToJobDetails(id)}
        />
      )
    );

  if (loading) {
    return <ButterflyLoader />;
  } else {
    return (
      <Grid container spacing={1} justify="center">
        <Grid item xs={4} className={classes.categoryBox}>
          <Grid container justify="center" alignContent="center">
            <Typography variant="h5" className={classes.categoryText}>
              Featured
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {renderJobsFeed(jobs)}
        </Grid>
        <Grid item xs={8} sm={4} className={classes.categoryBox}>
          <Grid container justify="center" alignContent="center">
            <Typography variant="h5" className={classes.categoryText}>
              Recently Posted
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {renderJobsFeed(jobs)}
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
