import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import JobSearchDashboard from "./JobSearchDashboard";
import HiringDashboard from "./HiringDashboard";

const Dashboard = () => {
  const classes = useStyles();
  const [user, setUser] = useState("employer");

  const renderDashboard = () => {
    if (user === "employee") {
      return <JobSearchDashboard />;
    }
    if (user === "employer") {
      return <HiringDashboard />;
    }
  };

  return (
    <Grid container justify="center" alignContent="center">
      <div className={classes.root}>{renderDashboard()}</div>
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    "@media (max-width: 780px)": {
      overflow: "scroll"
    }
  }
}));

export default Dashboard;
