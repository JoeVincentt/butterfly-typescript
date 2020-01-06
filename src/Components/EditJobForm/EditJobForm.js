import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Fab } from "@material-ui/core";
import { ArrowForward, ArrowBack } from "@material-ui/icons";

import colors from "../../constants/colors";

import JobDescription from "./FormComponents/JobDescription";
import PreviewJobPosting from "./FormComponents/PreviewJobPosting";
import CustomStepper from "../Custom/CustomStepper";

import "./EditJobForm.css";
import { PaymentStateContext } from "../../StateManagement/PaymentState";
import { PostJobStateContext } from "../../StateManagement/PostJobState";

const getSteps = () => {
  return ["Description", "Preview", "Advertisement Plan", "Payment"];
};

const getStepContent = stepIndex => {
  switch (stepIndex) {
    case 0:
      return <JobDescription />;
    case 1:
      return <PreviewJobPosting />;
    default:
      return "Unknown stepIndex";
  }
};

const PostJobForm = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const { paymentSuccess } = useContext(PaymentStateContext);
  const jobState = useContext(PostJobStateContext);

  const steps = getSteps();

  const saveJobDraft = () => {
    let jobDraft = {
      logo: jobState.logo,
      companyName: jobState.companyName,
      companyLocation: jobState.companyLocation,
      companyWebsite: jobState.companyWebsite,
      companyAbout: jobState.companyAbout,
      title: jobState.title,
      category: jobState.category,
      jobType: jobState.jobType,
      about: jobState.about,
      hiringProcessSteps: jobState.hiringProcessSteps,
      requirements: jobState.requirements,
      responsibilities: jobState.responsibilities,
      educationAndExperience: jobState.educationAndExperience,
      skills: jobState.skills,
      compensationAndBenefits: jobState.compensationAndBenefits,
      additionalInformation: jobState.additionalInformation,
      externalJobPostingLink: jobState.externalJobPostingLink
    };
    localStorage.setItem("jobEditDraft", JSON.stringify(jobDraft));
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // saveJobDraft();
    }
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const renderButtons = () => (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      className={classes.buttonContainer}
    >
      {paymentSuccess ? null : (
        <Fab
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="extended"
          size="medium"
          aria-label="add"
          className={classes.backButton}
        >
          <ArrowBack className={classes.extendedIconRightMargin} />
          Back
        </Fab>
      )}
      {// !paymentSuccess &&
      activeStep === steps.length - 1 ? null : (
        <Fab
          onClick={handleNext}
          variant="extended"
          size="medium"
          className={classes.nextOrFinishButton}
          aria-label="add"
        >
          {activeStep === steps.length - 1 ? "Finish" : "Next"}
          <ArrowForward className={classes.extendedIconLeftMargin} />
        </Fab>
      )}
    </Grid>
  );

  return (
    <React.Fragment>
      <Helmet>
        <title>Post A Job</title>
      </Helmet>
      <Grid container direction="column">
        <CustomStepper activeStep={activeStep} steps={steps} />
        <div>
          {activeStep === steps.length ? (
            <Grid container direction="column">
              {/* <ThankYouCard handleReset={handleReset} /> */}
            </Grid>
          ) : (
            <Grid container direction="column" alignContent="center">
              {getStepContent(activeStep)}
              {renderButtons()}
            </Grid>
          )}
        </div>
      </Grid>
    </React.Fragment>
  );
};

const useStyles = makeStyles(theme => ({
  backButton: {
    marginRight: theme.spacing(2),
    color: colors.purple,
    backgroundColor: colors.grey
  },
  nextOrFinishButton: {
    marginLeft: theme.spacing(2),
    color: colors.grey,
    backgroundColor: colors.purple
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },

  buttonContainer: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(10)
  },
  extendedIconRightMargin: {
    marginRight: theme.spacing(1)
  },
  extendedIconLeftMargin: {
    marginLeft: theme.spacing(1)
  }
}));

export default PostJobForm;
