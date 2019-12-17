import React, { Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import { LinearProgress } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import ScrollToTheTop from "./ScrollToTheTop";

import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import JobsFeed from "./JobsFeed/JobsHomeFeed";
import CompanyBar from "./CompanyBar/CompanyBar";

import Subscribe from "./Pre-subscription/Subscribe";

import { jobs } from "../MockUpData/jobs";
import colors from "../constants/colors";

const JobDescriptionPageRender = React.lazy(() =>
  import("./JobDescriptionPage/JobDescriptionPageRender")
);
const SignIn = React.lazy(() => import("./Auth/SignIn/SignIn"));
const SignUp = React.lazy(() => import("./Auth/SignUp/SignUp"));
const PostJobForm = React.lazy(() => import("./JobPostForm/PostJobForm"));
const DashboardOverview = React.lazy(() =>
  import("./Dashboard/DashboardOverview")
);
const EmployeeDashboard = React.lazy(() =>
  import("./Dashboard/EmployeeDashboard/EmployeeDashboard")
);
const ApplicantsList = React.lazy(() =>
  import("./Dashboard/EmployerDashboard/ApplicantsList")
);
const JobListingsOverview = React.lazy(() =>
  import("./Dashboard/EmployerDashboard/JobListingsOverview")
);
const JobByCategory = React.lazy(() =>
  import("./JobsFeed/JobByCategoryPage/JobByCategory")
);
const NoMatch = React.lazy(() => import("./404 Page/NoMatch"));

// import JobDescriptionPageRender from "./JobDescriptionPage/JobDescriptionPageRender";
// import SignIn from "./Auth/SignIn/SignIn";
// import SignUp from "./Auth/SignUp/SignUp";
// import PostJobForm from "./JobPostForm/PostJobForm";
// import DashboardOverview from "./Dashboard/DashboardOverview";
// import EmployeeDashboard from "./Dashboard/EmployeeDashboard/EmployeeDashboard";
// import ApplicantsList from "./Dashboard/EmployerDashboard/ApplicantsList";
// import JobListingsOverview from "./Dashboard/EmployerDashboard/JobListingsOverview";
// import JobByCategory from "./JobsFeed/JobByCategoryPage/JobByCategory";
// import NoMatch from "./404 Page/NoMatch";

const Content = props => {
  const classes = useStyles();

  return (
    <Suspense
      fallback={
        <div className={classes.loadingBar}>
          <CompanyBar />
          <LinearProgress />
        </div>
      }
    >
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

            <Route exact path="/job-description/:id">
              <JobDescriptionPageRender />
            </Route>

            <Route exact path="/job-by-category/:categoryID">
              <JobByCategory />
            </Route>

            <ProtectedRoute exact path="/post-a-job" component={PostJobForm} />
            <ProtectedRoute
              exact
              path="/dashboard-overview"
              component={DashboardOverview}
            />
            <ProtectedRoute
              exact
              path="/dashboard-employee"
              component={EmployeeDashboard}
            />
            <ProtectedRoute
              exact
              path="/dashboard-employer/applicants-list"
              component={ApplicantsList}
            />
            <ProtectedRoute
              exact
              path="/dashboard-employer/job-listings"
              component={JobListingsOverview}
            />

            <Route exact path="/sign-in">
              <SignIn />
            </Route>

            <Route exact path="/sign-up">
              <SignUp />
            </Route>

            <Route path="*" component={NoMatch} />
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
    </Suspense>
  );
};

const useStyles = makeStyles(theme => ({
  loadingBar: {
    paddingTop: 54,
    "@media (min-width: 600px)": {
      paddingTop: 64
    }
  },
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
