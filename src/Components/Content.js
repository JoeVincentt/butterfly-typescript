import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Container } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import ScrollToTheTop from "./ScrollToTheTop";

import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import ProfileForm from "./Forms/ProfileForm/ProfileForm";
// import JobDescriptionPage from "./JobDescriptionPage/JobDescriptionPage";
import SignIn from "./Auth/SignIn/SignIn";
import SignUp from "./Auth/SignUp/SignUp";
import PostJobForm from "./Forms/PostJobFormGroup/PostJobForm";
import JobsFeed from "./JobsFeed/JobsFeed";
import CompanyBar from "./CompanyBar/CompanyBar";

import { jobs } from "../MockUpData/jobs";

const Content = props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Toolbar id="back-to-top-anchor" />
      <Navbar />
      {/* <CompanyBar /> */}
      {/* <SignUp /> */}
      {/* <Container component="main" className={classes.main}> */}
      <PostJobForm />
      {/* <ProfileForm /> */}
      {/* <JobDescriptionPage /> */}
      {/* <ProfileForm /> */}

      {/* <JobsFeed
          jobs={jobs}
          // id={id}
          // title={title}
          // location={location}
          // company={company}
          // companyId={companyId}
          // logoImage={logoImage}
          // altLogoText={altLogoText}
          // date={date}
        /> */}
      {/* </Container> */}

      <Footer />

      <ScrollToTheTop {...props}>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollToTheTop>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh"
  },
  main: {
    marginBottom: theme.spacing(2)
  }
}));

export default Content;
