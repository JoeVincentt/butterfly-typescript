import React, { useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import { useSnackbar } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Fab } from "@material-ui/core";
import { ArrowForward, ArrowBack, Update } from "@material-ui/icons";

import colors from "../../constants/colors";

import JobDescription from "./FormComponents/JobDescription";
import PreviewJobPosting from "./FormComponents/PreviewJobPosting";
import CustomStepper from "../Custom/CustomStepper";

import "./EditJobForm.css";

import { UserStateContext } from "../../StateManagement/UserState";
import {
  EditJobStateContext,
  EditJobDispatchContext
} from "../../StateManagement/EditJobState";

const getSteps = () => {
  return ["Description", "Preview"];
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

const EditJobForm = props => {
  const db = firebase.firestore();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { uid } = useContext(UserStateContext);
  const dispatch = useContext(EditJobDispatchContext);
  const jobState = useContext(EditJobStateContext);

  const [activeStep, setActiveStep] = useState(0);
  const [jobID, setJobID] = useState("");

  const steps = getSteps();

  useEffect(() => {
    if (props.match.params.id !== null) {
      getJobDescription();
    }
  }, [props.match.params.id]);

  const getJobDescription = async () => {
    const id = props.match.params.id.toString();
    setJobID(id);
    try {
      const querySnapshot = await db
        .collection("jobs")
        .where("id", "==", id)
        // .where("status", "==", "active")
        .get();
      if (querySnapshot.size > 0) {
        // Contents of first document
        // console.log(querySnapshot.docs[0].data());
        const job = querySnapshot.docs[0].data();
        dispatch({
          type: "setJobDescription",
          payload: job
        });
      } else {
      }
    } catch (error) {}
  };

  const updateJobPosting = async () => {
    try {
      await db
        .collection("jobStats")
        .doc(uid)
        .collection("jobStats")
        .doc(jobID)
        .update({
          title: jobState.title
        });
    } catch (error) {}
    try {
      await db
        .collection("jobs")
        .doc(jobID)
        .update({
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
        });
      enqueueSnackbar("Job Posting Successfully Updated.", {
        variant: "success"
      });
    } catch (error) {
      enqueueSnackbar("Oops! Something went wrong! Please try again.", {
        variant: "error"
      });
    }
  };

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

      {activeStep === steps.length - 1 ? (
        <Fab
          onClick={() => updateJobPosting()}
          variant="extended"
          size="medium"
          className={classes.nextOrFinishButton}
          aria-label="add"
        >
          Update
          <Update className={classes.extendedIconLeftMargin} />
        </Fab>
      ) : (
        <Fab
          onClick={handleNext}
          variant="extended"
          size="medium"
          className={classes.nextOrFinishButton}
          aria-label="add"
        >
          Next
          <ArrowForward className={classes.extendedIconLeftMargin} />
        </Fab>
      )}
    </Grid>
  );

  return (
    <React.Fragment>
      <Helmet>
        <title>Edit A Job</title>
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

export default withRouter(EditJobForm);
