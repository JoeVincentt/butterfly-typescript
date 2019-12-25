import React, { Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { ProtectedRoute } from "./utils/ProtectedRoute";
import { makeStyles } from "@material-ui/core/styles";
import { LinearProgress, CssBaseline, Fab, Toolbar } from "@material-ui/core";

import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import ScrollToTheTop from "./ScrollToTheTop";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import JobsHomeFeed from "./JobsFeed/JobsHomeFeed";
import CompanyBar from "./CompanyBar/CompanyBar";
import CookieBanner from "./Footer/FooterComponents/CookieBanner";
import Subscribe from "./Pre-subscription/Subscribe";

import colors from "../constants/colors";

const JobDescriptionPageRender = React.lazy(() =>
  import("./JobDescriptionPage/JobDescriptionPageRender")
);
const SignIn = React.lazy(() => import("./Auth/SignIn/SignIn"));
const SignUp = React.lazy(() => import("./Auth/SignUp/SignUp"));
const ResetPassword = React.lazy(() =>
  import("./Auth/ResetPassword/ResetPassword")
);
const PostJobForm = React.lazy(() => import("./JobPostForm/PostJobForm"));
const DashboardOverview = React.lazy(() =>
  import("./Dashboard/DashboardOverview")
);
const EmployeeDashboard = React.lazy(() =>
  import("./Dashboard/EmployeeDashboard/EmployeeDashboard")
);
const ApplicantsListRender = React.lazy(() =>
  import("./Dashboard/EmployerDashboard/ApplicantsListRender")
);
const JobListingsOverview = React.lazy(() =>
  import("./Dashboard/EmployerDashboard/JobListingsOverview")
);
const JobByCategory = React.lazy(() =>
  import("./JobsFeed/JobByCategoryPage/JobByCategory")
);
const About = React.lazy(() => import("./Footer/FooterComponents/About"));
const ContactUs = React.lazy(() =>
  import("./Footer/FooterComponents/ContactUs")
);
const NoMatch = React.lazy(() => import("./404 Page/NoMatch"));
// const PrivacyPolicy = React.lazy(() =>
//   import("./Footer/FooterComponents/PrivacyPolicy")
// );
// const TermsAndConditions = React.lazy(() =>
//   import("./Footer/FooterComponents/TermsAndConditions")
// );

const Content = props => {
  const classes = useStyles();

  return (
    <Suspense fallback={<LinearProgress />}>
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

            <Route exact path="/" component={JobsHomeFeed} />
            <Route exact path="/about" component={About} />
            <Route exact path="/contact-us" component={ContactUs} />
            {/* <Route exact path="/privacy-policy" component={PrivacyPolicy} />
            <Route
              exact
              path="/terms-and-conditions"
              component={TermsAndConditions}
            /> */}
            <Route exact path="/sign-in" component={SignIn} />
            <Route exact path="/sign-up" component={SignUp} />
            <Route exact path="/reset-password" component={ResetPassword} />
            <Route
              exact
              path="/job-description/:id"
              component={JobDescriptionPageRender}
            />
            <Route
              exact
              path="/job-by-category/:categoryID"
              component={JobByCategory}
            />

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
              path="/dashboard-employer/applicants-list/:jobID"
              component={ApplicantsListRender}
            />
            <ProtectedRoute
              exact
              path="/dashboard-employer/job-listings"
              component={JobListingsOverview}
            />
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
        <CookieBanner />
        <Footer />
      </Router>
    </Suspense>
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
