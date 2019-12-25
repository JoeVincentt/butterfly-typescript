import React, { useState, useContext, useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import uuid from "uuid/v4";
import axios from "axios";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  LinearProgress,
  CircularProgress
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import DescriptionIcon from "@material-ui/icons/Description";
import { useDropzone } from "react-dropzone";
import {
  UserDispatchContext,
  UserStateContext
} from "../../../StateManagement/UserState";
import GradientButton from "../../Buttons/GradientButton";

import listOfCountries from "./FormComponents/ListOfCountries";
import listOfYearsOfExperience from "./FormComponents/ListOfYearsOfExperience";
import listOfTimezones from "./FormComponents/ListOfTimezones";
import colors from "../../../constants/colors";

const ApplicationForm = ({
  jobTitle,
  jobID,
  postedBy,
  companyName,
  handleClose
}) => {
  const classes = useStyles();
  const db = firebase.firestore();
  //Notifications
  const { enqueueSnackbar } = useSnackbar();
  //Context
  const state = useContext(UserStateContext);
  const dispatch = useContext(UserDispatchContext);
  //Functional State
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  //DropZone Parameters
  const {
    acceptedFiles,
    rejectedFiles,
    getRootProps,
    getInputProps
  } = useDropzone({
    accept:
      "application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    multiple: false,
    maxSize: 200000
  });
  //Input Ref
  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);
  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);
  //Image Upload
  useEffect(() => {
    if (acceptedFiles.length !== 0) {
      uploadToStorage();
    }
  }, [acceptedFiles, rejectedFiles]);

  //Data storage Upload File
  const uploadToStorage = () => {
    const date = Date.now();
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef
      .child(
        `resumes/${state.uid}/${state.firstName}-${state.lastName}-resume-${date}`
      )
      .put(acceptedFiles[0]);
    uploadTask.on(
      "state_changed",
      snapshot => {
        // progress function ....
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      error => {
        // error function ....
        enqueueSnackbar("Oops! Something went wrong! Please try again.", {
          variant: "error"
        });
      },
      () => {
        // complete function ....
        storageRef
          .child("resumes")
          .child(state.uid)
          .child(`${state.firstName}-${state.lastName}-resume-${date}`)
          .getDownloadURL()
          .then(url => {
            dispatch({
              type: "field",
              fieldName: "resume",
              payload: url
            });
            enqueueSnackbar("Resume Updated.", {
              variant: "success"
            });
          })
          .catch(error => {
            enqueueSnackbar("Oops! Something went wrong! Please try again.", {
              variant: "error"
            });
          });
      }
    );
  };

  const employerEmailNotification = async (
    postedBy,
    jobTitle,
    email,
    firstName,
    lastName
  ) => {
    // Example POST method implementation:
    const data = {
      postedBy: postedBy,
      jobTitle: jobTitle,
      email: email,
      firstName: firstName,
      lastName: lastName
    };

    try {
      const response = await axios({
        method: "POST",
        url:
          "https://us-central1-butterfly-remote-jobs-dev.cloudfunctions.net/notifyEmployerByEmailWhenNewApplication",
        data: data
      });
      // console.log(response);
      if (response.data.success === true) {
        // console.log(response.data);
        // enqueueSnackbar("Great! We Notified Employer.", {
        //   variant: "success"
        // });
      }
      if (response.data.success === false) {
        // console.log(response.data);
        // enqueueSnackbar("Oops! Something went wrong! Please try again.", {
        //   variant: "error"
        // });
      }
    } catch (error) {
      // enqueueSnackbar("Oops! Something went wrong! Please try again.", {
      //   variant: "error"
      // });
    }
  };

  const applyForPosition = async () => {
    setLoading(true);
    const applicationID = uuid();

    //NOTIFY EMPLOYER BY EMAIL
    employerEmailNotification(
      postedBy,
      jobTitle,
      state.email,
      state.firstName,
      state.lastName
    );
    //ADD APPLICATION TO EMPLOYER DASHBOARD
    try {
      await db
        .collection("applications-employer")
        .doc(postedBy)
        .collection("applications")
        .doc(applicationID)
        .set({
          id: applicationID,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          date: Date.now(),
          jobID: jobID,
          jobTitle: jobTitle,
          companyName: companyName,
          email: state.email,
          firstName: state.firstName,
          lastName: state.lastName,
          country: state.country,
          zipCode: state.zipCode,
          yearsOfExperience: state.yearsOfExperience,
          timezone: state.timezone,
          resume: state.resume,
          status: "unchecked"
        });
      enqueueSnackbar("Application Sent", {
        variant: "success"
      });
      handleClose();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Oops! Something went wrong! Please try again.", {
        variant: "error"
      });
    }

    //ADD APPLICATION TO EMPLOYEE DASHBOARD
    try {
      await db
        .collection("applications-employee")
        .doc(state.uid)
        .collection("applications")
        .doc(applicationID)
        .set({
          id: applicationID,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          date: Date.now(),
          jobID: jobID,
          jobTitle: jobTitle,
          companyName: companyName,
          resume: state.resume
        });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar("Oops! Something went wrong! Please try again.", {
        variant: "error"
      });
    }

    //UPDATE EMPLOYEE DASHBOARD STATS
    try {
      await db
        .collection("dashboardStats")
        .doc(state.uid)
        .update({
          "employeeStats.totalApplications": firebase.firestore.FieldValue.increment(
            1
          )
        });
    } catch (error) {}

    //UPDATE EMPLOYER DASHBOARD STATS
    try {
      await db
        .collection("dashboardStats")
        .doc(postedBy)
        .update({
          "employerStats.totalApplicants": firebase.firestore.FieldValue.increment(
            1
          ),
          "employerStats.newApplicants": firebase.firestore.FieldValue.increment(
            1
          )
        });
    } catch (error) {}

    //UPDATE JOB STATS
    try {
      await db
        .collection("jobStats")
        .doc(postedBy)
        .collection("jobStats")
        .doc(jobID)
        .update({
          applied: firebase.firestore.FieldValue.increment(1)
        });
    } catch (error) {}

    //UPDATING PROFILE
    try {
      let jobsAppliedUpdated = [...state.jobsApplied, jobID];
      dispatch({
        type: "field",
        fieldName: "jobsApplied",
        payload: jobsAppliedUpdated
      });
      if (state.modified) {
        await db
          .collection("users")
          .doc(state.uid)
          .update({
            firstName: state.firstName,
            lastName: state.lastName,
            country: state.country,
            zipCode: state.zipCode,
            timezone: state.timezone,
            yearsOfExperience: state.yearsOfExperience,
            resume: state.resume,
            jobsApplied: jobsAppliedUpdated
          });
      } else {
        await db
          .collection("users")
          .doc(state.uid)
          .update({
            jobsApplied: jobsAppliedUpdated
          });
      }
    } catch (error) {}
  };

  const acceptedFilesItems = acceptedFiles.map((file, index) => {
    if (index === 0) {
      return (
        <div
          key={file.path}
          className={classes.margin}
          style={{ color: "green" }}
        >
          Accepted: {file.path}
        </div>
      );
    }
  });

  const rejectedFilesItems = rejectedFiles.map((file, index) => {
    if (index === 0) {
      return (
        <div
          key={file.path}
          className={classes.margin}
          style={{ color: "red" }}
        >
          Rejected: {file.path}
        </div>
      );
    }
  });

  return (
    <Grid
      container
      justify="center"
      alignContent="center"
      className={classes.root}
    >
      <Grid item xs={12}>
        <Paper elevation={0}>
          <Grid container spacing={2} justify="center" alignContent="center">
            <Grid item xs={12}>
              <Typography className={classes.title} variant="h6">
                Profile
              </Typography>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Grid container spacing={3}>
                {/* First Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="firstName"
                    className={classes.textField}
                    label="First Name"
                    variant="standard"
                    fullWidth
                    disabled={loading}
                    value={state.firstName}
                    onChange={e =>
                      dispatch({
                        type: "field",
                        fieldName: "firstName",
                        payload: e.target.value
                      })
                    }
                  />
                </Grid>
                {/* Last Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="lastName"
                    className={classes.textField}
                    label="Last Name"
                    variant="standard"
                    fullWidth
                    disabled={loading}
                    value={state.lastName}
                    onChange={e =>
                      dispatch({
                        type: "field",
                        fieldName: "lastName",
                        payload: e.target.value
                      })
                    }
                  />
                </Grid>

                {/* Country*/}
                <Grid item xs={12} sm={6}>
                  <FormControl
                    variant="standard"
                    className={classes.formControl}
                  >
                    <InputLabel ref={inputLabel} id="country-input-label">
                      Country
                    </InputLabel>
                    <Select
                      labelId="country-select-label"
                      id="country"
                      labelWidth={labelWidth}
                      disabled={loading}
                      value={state.country}
                      onChange={e =>
                        dispatch({
                          type: "field",
                          fieldName: "country",
                          payload: e.target.value
                        })
                      }
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {listOfCountries.map((country, index) => (
                        <MenuItem key={index} value={country}>
                          {country}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/* Zip Code */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="zipCode"
                    className={classes.textField}
                    label="Zip Code"
                    variant="standard"
                    type="number"
                    fullWidth
                    disabled={loading}
                    value={state.zipCode}
                    onChange={e =>
                      dispatch({
                        type: "field",
                        fieldName: "zipCode",
                        payload: e.target.value
                      })
                    }
                  />
                </Grid>

                {/* Timezone */}
                <Grid item xs={12} sm={6}>
                  <FormControl
                    variant="standard"
                    className={classes.formControl}
                  >
                    <InputLabel ref={inputLabel} id="timezone-input-label">
                      Timezone
                    </InputLabel>
                    <Select
                      labelId="timezone-select-label"
                      id="timezone"
                      labelWidth={labelWidth}
                      disabled={loading}
                      value={state.timezone}
                      onChange={e =>
                        dispatch({
                          type: "field",
                          fieldName: "timezone",
                          payload: e.target.value
                        })
                      }
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {listOfTimezones.map((timezone, index) => (
                        <MenuItem key={index} value={timezone.offset}>
                          {timezone.offset} - {timezone.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Years Of Experience */}
                <Grid item xs={12} sm={6}>
                  <FormControl
                    variant="standard"
                    className={classes.formControl}
                  >
                    <InputLabel
                      ref={inputLabel}
                      id="yearsOfExperience-input-label"
                    >
                      Years of Relevant Experience
                    </InputLabel>
                    <Select
                      labelId="yearsOfExperience-select-label"
                      id="yearsOfExperience"
                      labelWidth={labelWidth}
                      disabled={loading}
                      value={state.yearsOfExperience}
                      onChange={e =>
                        dispatch({
                          type: "field",
                          fieldName: "yearsOfExperience",
                          payload: e.target.value
                        })
                      }
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {listOfYearsOfExperience.map((years, index) => (
                        <MenuItem key={index} value={years.value}>
                          {years.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Resume Button */}
                {state.resume !== "" && (
                  <Grid item xs={12}>
                    <a
                      href={state.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <Button color="primary" size="large" disabled={loading}>
                        <DescriptionIcon style={{ marginRight: 3 }} />
                        Current Resume
                      </Button>
                    </a>
                  </Grid>
                )}

                {/* Resume */}
                <Grid item xs={12} className={classes.dragAndDropContainer}>
                  <Paper elevation={0} className={classes.dragAndDropPaper}>
                    <Grid
                      container
                      direction="column"
                      justify="center"
                      alignContent="center"
                    >
                      <Grid
                        container
                        direction="column"
                        justify="center"
                        alignContent="center"
                        {...getRootProps({ className: "dropzone" })}
                      >
                        <Grid item>
                          <Grid
                            container
                            direction="column"
                            justify="center"
                            alignContent="center"
                          >
                            <input {...getInputProps()} />
                            <CloudUploadOutlinedIcon
                              className={classes.uploadIcon}
                            />
                          </Grid>
                        </Grid>
                        <Grid item>
                          {" "}
                          <Grid
                            container
                            direction="column"
                            justify="center"
                            alignContent="center"
                          >
                            <Typography
                              variant="h6"
                              className={classes.purpleText}
                            >
                              Upload Your Resume Here
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item>
                          {" "}
                          <Typography variant="caption" color="textSecondary">
                            (Only *.pdf, *.doc, *.docx. 200KB MAX size)
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid
                            container
                            direction="column"
                            alignContent="center"
                            justify="center"
                            alignItems="center"
                          >
                            {acceptedFilesItems}
                            {rejectedFilesItems}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    {progress !== null && progress !== 100 && (
                      <LinearProgress variant="determinate" value={progress} />
                    )}
                  </Paper>
                </Grid>

                {/* Update Profile Button */}
                <Grid item xs={12}>
                  <Grid container justify="center" alignItems="center">
                    {loading ? (
                      <CircularProgress />
                    ) : (
                      <GradientButton
                        text="Apply for position"
                        labelName="applyProfile"
                        size="large"
                        onClick={() => !loading && applyForPosition()}
                      />
                    )}
                  </Grid>
                  {/* <Grid container justify="center" alignItems="center">
                    {error && (
                      <Typography variant="caption" color="secondary">
                        Error Occurred. Please try again later.
                      </Typography>
                    )}
                  </Grid> */}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    // minHeight: "100vh"
  },
  paper: {
    // padding: theme.spacing(4, 2),
  },
  margin: {
    margin: theme.spacing(2)
  },
  formControl: {
    minWidth: "100%"
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  dragAndDropContainer: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1)
  },
  dragAndDropPaper: {
    padding: theme.spacing(2),
    border: "1px solid rgba(107, 19, 107, 0.2)"
  },
  uploadIcon: {
    fontSize: "5rem",
    color: colors.mediumGrey
  },
  purpleText: {
    color: colors.purple,
    textDecoration: "underline"
  }
}));

export default ApplicationForm;
