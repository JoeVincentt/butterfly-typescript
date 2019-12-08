import React, { useState, useContext, useEffect, useRef } from "react";
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
import listOfCurrentCareerLevel from "./FormComponents/ListOfCurrentCareerLevel";
import colors from "../../../constants/colors";

const ApplicationForm = ({ jobTitle, jobID, postedBy, companyName }) => {
  const classes = useStyles();
  const db = firebase.firestore();
  //Context
  const state = useContext(UserStateContext);
  const dispatch = useContext(UserDispatchContext);
  //Functional State
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  //DropZone Parameters
  const {
    acceptedFiles,
    rejectedFiles,
    getRootProps,
    getInputProps
  } = useDropzone({
    accept: "application/pdf, .doc, .docx, application/msword",
    multiple: false,
    maxSize: 200000
  });

  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);
  useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  //Image Upload
  useEffect(() => {
    if (acceptedFiles.length !== 0) {
      // setLogo(acceptedFiles[0].preview);
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
        // console.log(error);
      },
      () => {
        // complete function ....
        storageRef
          .child("resumes")
          .child(state.uid)
          .child(`${state.firstName}-${state.lastName}-resume-${date}`)
          .getDownloadURL()
          .then(url => {
            // console.log(url);
            dispatch({
              type: "field",
              fieldName: "resume",
              payload: url
            });

            // setResume(url);
          })
          .catch(error => {
            // console.log(error);
          });
      }
    );
  };

  const applyForPosition = () => {
    setLoading(true);
    // console.log(jobTitle, jobID, state.email, postedBy);
    // console.log("apply");
    // db.collection("applications")
    //   .doc(postedBy)
    //   .collection("applications")
    //   .get()
    //   .then(docs => {
    //     console.log(docs);
    //     // if (docs.exists) {
    //     //   console.log("Document data:", doc.data());
    //     // } else {
    //     //   // doc.data() will be undefined in this case
    //     //   console.log("No such document!");
    //     // }
    //   })
    //   .catch(function(error) {
    //     console.log("Error getting document:", error);
    //   });

    //ADD APPLICATION TO EMPLOYER
    db.collection("applications-employer")
      .doc(postedBy)
      .collection("applications")
      .doc()
      .set({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        jobID: jobID,
        jobTitle: jobTitle,
        email: state.email,
        firstName: state.firstName,
        lastName: state.lastName,
        country: state.country,
        zipCode: state.zipCode,
        currentCareerLevel: state.currentCareerLevel,
        resume: state.resume,
        status: "unchecked"
      })
      .then(() => setLoading(false))
      .catch(error => {
        setLoading(false);
        setError(true);
        // console.log(error);
      });

    //ADD APPLICATION TO EMPLOYEE
    db.collection("applications-employee")
      .doc(state.uid)
      .collection("applications")
      .doc()
      .set({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        jobID: jobID,
        jobTitle: jobTitle,
        companyName: companyName,
        email: state.email,
        firstName: state.firstName,
        lastName: state.lastName,
        resume: state.resume
      })
      .then(() => setLoading(false))
      .catch(error => {
        setLoading(false);
        setError(true);
        // console.log(error);
      });

    // //UPDATING PROFILE
    if (state.modified) {
      db.collection("users")
        .doc(state.uid)
        .update({
          firstName: state.firstName,
          lastName: state.lastName,
          country: state.country,
          zipCode: state.zipCode,
          currentCareerLevel: state.currentCareerLevel,
          resume: state.resume,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .catch(error => {
          // console.log(error);
        });
    }
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

                {/* Current Career Level */}
                <Grid item xs={12}>
                  <FormControl
                    variant="standard"
                    className={classes.formControl}
                  >
                    <InputLabel
                      ref={inputLabel}
                      id="currentCareerLevel-input-label"
                    >
                      Current Career Level
                    </InputLabel>
                    <Select
                      labelId="currentCareerLevel-select-label"
                      id="currentCareerLevel"
                      labelWidth={labelWidth}
                      value={state.currentCareerLevel}
                      onChange={e =>
                        dispatch({
                          type: "field",
                          fieldName: "currentCareerLevel",
                          payload: e.target.value
                        })
                      }
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {listOfCurrentCareerLevel.map((level, index) => (
                        <MenuItem key={index} value={level}>
                          {level}
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
                      <Button color="primary" size="large">
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
                          <Typography variant="subtitle2" color="textSecondary">
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
                  <Grid container justify="center" alignItems="center">
                    {error && (
                      <Typography variant="caption" color="secondary">
                        Error Occurred. Please try again later.
                      </Typography>
                    )}
                  </Grid>
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
    // boxShadow: shadows.purpleShadow
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
