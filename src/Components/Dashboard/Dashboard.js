import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import EmployeeDashboard from "./EmployeeDashboard";
import EmployerDashboard from "./EmployerDashboard";

const Dashboard = () => {
  const classes = useStyles();
  const [user, setUser] = useState("employer");

  const renderDashboard = () => {
    if (user === "employee") {
      return <EmployeeDashboard />;
    }
    if (user === "employer") {
      return <EmployerDashboard />;
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
