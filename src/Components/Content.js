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
import ProfileForm from "./Forms/ProfileForm/ProfileForm";
import JobDescriptionPageRender from "./JobDescriptionPage/JobDescriptionPageRender";
import SignIn from "./Auth/SignIn/SignIn";
import SignUp from "./Auth/SignUp/SignUp";
import PostJobForm from "./Forms/PostJobForm/PostJobForm";
import JobsFeed from "./JobsFeed/JobsFeed";
import CompanyBar from "./CompanyBar/CompanyBar";
import Dashboard from "./Dashboard/Dashboard";
import Subscribe from "./Pre-subscription/Subscribe";
import NoMatch from "./NoMatch";

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
        <Switch>
          {/* <Route path="/">
            <Subscribe />
          </Route> */}

          <Route exact path="/">
            <CompanyBar />
            <Container component="main" className={classes.main}>
              <JobsFeed jobs={jobs} />
            </Container>
          </Route>

          <Route path="/profile">
            <ProfileForm />
          </Route>
          <Route path="/job-description/:id">
            <JobDescriptionPageRender />
          </Route>

          <Route path="/post-a-job">
            <PostJobForm />
          </Route>

          <Route path="/dashboard">
            <Dashboard />
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
