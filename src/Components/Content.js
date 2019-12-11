import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import ScrollToTheTop from "./ScrollToTheTop";

import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import JobDescriptionPageRender from "./JobDescriptionPage/JobDescriptionPageRender";
import SignIn from "./Auth/SignIn/SignIn";
import SignUp from "./Auth/SignUp/SignUp";
import PostJobForm from "./JobPostForm/PostJobForm";
import JobsFeed from "./JobsFeed/JobsFeed";
import CompanyBar from "./CompanyBar/CompanyBar";
import DashboardOverview from "./Dashboard/DashboardOverview";
import EmployeeDashboard from "./Dashboard/EmployeeDashboard/EmployeeDashboard";
import ApplicantsList from "./Dashboard/EmployerDashboard/ApplicantsList";
import JobListingsOverview from "./Dashboard/EmployerDashboard/JobListingsOverview";
import JobByCategory from "./JobByCategoryPage/JobByCategory";
import NoMatch from "./NoMatch";

import Subscribe from "./Pre-subscription/Subscribe";

import { jobs } from "../MockUpData/jobs";
import colors from "../constants/colors";

const Content = props => {
  const classes = useStyles();

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <Toolbar id="back-to-top-anchor" />
        <Navbar />
        <CompanyBar />
        <Switch>
          {/* <Route path="/">
            <Subscribe />
          </Route> */}

          <Route exact path="/">
            <JobsFeed jobs={jobs} />
          </Route>

          <Route path="/job-description/:id">
            <JobDescriptionPageRender />
          </Route>

          <Route path="/job-by-category/:categoryID">
            <JobByCategory />
          </Route>

          <Route path="/post-a-job">
            <PostJobForm />
          </Route>

          <Route path="/dashboard-overview">
            <DashboardOverview />
          </Route>

          <Route path="/dashboard-employee">
            <EmployeeDashboard />
          </Route>

          <Route path="/dashboard-employer/applicants-list">
            <ApplicantsList />
          </Route>

          <Route path="/dashboard-employer/job-listings">
            <JobListingsOverview />
          </Route>

          <Route path="/sign-in">
            <SignIn />
          </Route>

          <Route path="/sign-up">
            <SignUp />
          </Route>
          <Route component={NoMatch} />
        </Switch>

        <ScrollToTheTop {...props}>
          <Fab
            color="secondary"
            size="small"
            aria-label="scroll back to top"
            className={classes.scrollToTheTop}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollToTheTop>
      </div>
      <Footer />
    </Router>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh"
  },
  main: {
    flex: 1,
    marginBottom: theme.spacing(2)
  },
  scrollToTheTop: {
    backgroundColor: colors.purple
  }
}));

export default Content;
