import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import firebase from "firebase/app";
import "firebase/firestore";
import {
  Grid,
  Typography,
  Paper,
  Divider,
  Button,
  LinearProgress
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import WorkOutlineIcon from "@material-ui/icons/WorkOutline";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import CheckIcon from "@material-ui/icons/Check";
import { UserStateContext } from "../../StateManagement/UserState";

const DashboardOverview = props => {
  const classes = useStyles();
  const db = firebase.firestore();

  const state = useContext(UserStateContext);

  const [employerStats, setEmployerStats] = useState({
    jobsPosted: 0,
    newApplicants: 0,
    totalApplicants: 0
  });
  const [employeeStats, setEmployeeStats] = useState({ totalApplications: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.collection("dashboardStats")
      .doc(state.uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          const document = doc.data();
          setEmployeeStats(document.employeeStats);
          setEmployerStats(document.employerStats);
          console.log("Document data:", doc.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
        setLoading(false);
      })
      .catch(error => {
        console.log("Error getting document:", error);
        setLoading(false);
      });
  }, []);

  const renderEmployerDashboardOverview = () => (
    <Paper className={classes.rootPaper}>
      <Grid container direction="column" spacing={4}>
        <Grid item>
          <Typography variant="h6">Employer Dashboard Overview</Typography>
        </Grid>
        <Divider className={classes.divider} />
        <Grid item>
          <Grid container direction="row" spacing={1} alignItems="center">
            <Grid item xs={12} sm={4}>
              <Paper elevation={0} className={classes.itemPaper}>
                <Grid container direction="row" spacing={1}>
                  <Grid item>
                    <Grid
                      container
                      justify="center"
                      alignItems="center"
                      className={classes.workIconBox}
                    >
                      <WorkOutlineIcon className={classes.workIcon} />
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container direction="column">
                      <Typography variant="h3">
                        {employerStats.jobsPosted}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Jobs Posted
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={0} className={classes.itemPaper}>
                <Grid container direction="row" spacing={1}>
                  <Grid item>
                    <Grid
                      container
                      justify="center"
                      alignItems="center"
                      className={classes.totalApplicantsIconBox}
                    >
                      <PeopleOutlineIcon
                        className={classes.totalApplicantsIcon}
                      />
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container direction="column">
                      <Typography variant="h3">
                        {employerStats.totalApplicants}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Total Applicants
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper elevation={0} className={classes.itemPaper}>
                <Grid container direction="row" spacing={1}>
                  <Grid item>
                    <Grid
                      container
                      justify="center"
                      alignItems="center"
                      className={classes.newApplicantsIconBox}
                    >
                      <NotificationsNoneIcon
                        className={classes.newApplicantsIcon}
                      />
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container direction="column">
                      <Typography variant="h3">
                        {employerStats.newApplicants}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        New Applicants
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
              onClick={() =>
                props.history.push("/dashboard-employer/job-listings")
              }
            >
              Open
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
  const renderEmployeeDashboardOverview = () => (
    <Paper className={classes.rootPaper}>
      <Grid container direction="column" spacing={4}>
        <Grid item>
          <Typography variant="h6">Employee Dashboard Overview</Typography>
        </Grid>
        <Divider className={classes.divider} />
        <Grid>
          <Grid
            container
            direction="row"
            spacing={1}
            alignItems="center"
            className={classes.employeeStatsBox}
          >
            <Grid item item xs={12} sm={4}>
              <Paper elevation={0} className={classes.itemPaper}>
                <Grid container direction="row" spacing={1}>
                  <Grid item>
                    <Grid
                      container
                      justify="center"
                      alignItems="center"
                      className={classes.workIconBox}
                    >
                      <CheckIcon className={classes.workIcon} />
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container direction="column">
                      <Typography variant="h3">
                        {employeeStats.totalApplications}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Total Applications
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
              onClick={() => props.history.push("/dashboard-employee")}
            >
              Open
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
      <React.Fragment>
        <Helmet>
          <title>Dashboard Overview</title>
        </Helmet>
        <Grid container justify="center" alignContent="center">
          <Grid item xs={12} md={6} className={classes.paperBox}>
            {renderEmployerDashboardOverview()}
          </Grid>
          <Grid item xs={12} md={6} className={classes.paperBox}>
            {renderEmployeeDashboardOverview()}
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
};

const useStyles = makeStyles(theme => ({
  paperBox: {
    margin: theme.spacing(1)
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
  employeeStatsBox: {
    padding: theme.spacing(2)
  },
  workIconBox: {
    backgroundColor: "rgba(247, 119, 247, 0.3)",
    padding: 10,
    borderRadius: "50%",
    marginTop: 5
  },
  workIcon: {
    color: "rgb(216, 74, 216)"
  },
  totalApplicantsIconBox: {
    backgroundColor: "rgba(48, 74, 241, 0.3)",
    padding: 10,
    borderRadius: "50%",
    marginTop: 5
  },
  totalApplicantsIcon: {
    color: "rgb(35, 62, 239)"
  },
  newApplicantsIconBox: {
    backgroundColor: "rgba(62, 239, 35, 0.3)",
    padding: 10,
    borderRadius: "50%",
    marginTop: 5
  },
  newApplicantsIcon: {
    color: "rgb(44, 217, 17)"
  }
}));

export default withRouter(DashboardOverview);
