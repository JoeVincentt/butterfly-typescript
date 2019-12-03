import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Fab } from "@material-ui/core";
import { ArrowForward, ArrowBack } from "@material-ui/icons";

import colors from "../../../constants/colors";

import JobDescription from "./FormComponents/JobDescription";
import AdvertisementPlan from "./FormComponents/AdvertisementPlan";
import Payment from "./FormComponents/Payment";
import PreviewJobPosting from "./FormComponents/PreviewJobPosting";
import CustomStepper from "./FormComponents/CustomStepper";
import ThankYouCard from "./FormComponents/ThankYouCard";
import "./PostJobForm.css";

const getSteps = () => {
  return ["Description", "Preview", "Advertisement Plan", "Payment"];
};

const getStepContent = stepIndex => {
  switch (stepIndex) {
    case 0:
      return <JobDescription />;
    case 1:
      return <PreviewJobPosting />;
    case 2:
      return <AdvertisementPlan />;
    case 3:
      return <Payment />;
    default:
      return "Unknown stepIndex";
  }
};

const PostJobForm = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
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
    </Grid>
  );

  return (
    <Grid container direction="column">
      <CustomStepper activeStep={activeStep} steps={steps} />
      <div>
        {activeStep === steps.length ? (
          <Grid container direction="column">
            <ThankYouCard handleReset={handleReset} />
          </Grid>
        ) : (
          <Grid container direction="column" alignContent="center">
            {getStepContent(activeStep)}
            {renderButtons()}
          </Grid>
        )}
      </div>
    </Grid>
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
