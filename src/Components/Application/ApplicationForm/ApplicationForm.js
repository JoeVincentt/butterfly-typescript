import React, { useState, useContext, useEffect, useRef } from "react";
import firebase from "firebase/app";
import "firebase/storage";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  LinearProgress
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

const ProfileForm = () => {
  const classes = useStyles();
  //Context
  const state = useContext(UserStateContext);
  const dispatch = useContext(UserDispatchContext);

  //State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [currentCareerLevel, setCurrentCareerLevel] = useState("");
  const [resume, setResume] = useState("");

  //Functional State
  const [progress, setProgress] = useState(null);

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

  //Set Local State to values from global state
  useEffect(() => {
    setFirstName(state.firstName);
    setLastName(state.lastName);
    setCountry(state.country);
    setZipCode(state.zipCode);
    setCurrentCareerLevel(state.currentCareerLevel);
    setResume(state.resume);
  }, []);

  //Set Global State
  useEffect(() => {
    const profileUpdated = {
      firstName: firstName,
      lastName: lastName,
      country: country,
      zipCode: zipCode,
      currentCareerLevel: currentCareerLevel,
      resume: resume
    };
    dispatch({
      type: "updateProfile",
      payload: profileUpdated
    });
  }, [firstName, lastName, country, zipCode, currentCareerLevel, resume]);

  //Image Upload
  useEffect(() => {
    if (acceptedFiles.length !== 0) {
      // setLogo(acceptedFiles[0].preview);
      uploadToStorage();
    }
  }, [acceptedFiles, rejectedFiles]);

  //Data storage Upload File
  const uploadToStorage = () => {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef
      .child(`resumes/${state.uid}/${firstName}-${lastName}-resume`)
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
          .child(`${firstName}-${lastName}-resume`)
          .getDownloadURL()
          .then(url => {
            // console.log(url);
            setResume(url);
          })
          .catch(error => {
            // console.log(error);
          });
      }
    );
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
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
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
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
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
                      value={country}
                      onChange={e => setCountry(e.target.value)}
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
                    value={zipCode}
                    onChange={e => setZipCode(e.target.value)}
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
                      value={currentCareerLevel}
                      onChange={e => setCurrentCareerLevel(e.target.value)}
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
                {resume !== "" && (
                  <Grid item xs={12}>
                    <a
                      href={resume}
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
                    <GradientButton
                      text="Apply for position"
                      labelName="applyProfile"
                      size="large"
                      onClick={() => console.log("update")}
                    />
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

export default ProfileForm;
