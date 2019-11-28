import React from "react";
import { Grid, Paper, Typography, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import { useDropzone } from "react-dropzone";

import GradientButton from "../../Buttons/GradientButton";

import shadows from "../../../constants/shadows";

import listOfCountries from "./FormComponents/ListOfCountries";
import listOfCurrentCareerLevel from "./FormComponents/ListOfCurrentCareerLevel";
import colors from "../../../constants/colors";

const ProfileForm = () => {
  const classes = useStyles();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [zipCode, setZipCode] = React.useState("");
  const [currentCareerLevel, setCurrentCareerLevel] = React.useState("");

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  //DropZone Parameters
  const {
    acceptedFiles,
    rejectedFiles,
    getRootProps,
    getInputProps
  } = useDropzone({
    accept: "application/pdf"
  });

  const acceptedFilesItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));
  // const rejectedFilesItems = rejectedFiles.map(file => (
  //   <li key={file.path}>
  //     {file.path} - {file.size} bytes
  //   </li>
  // ));

  const handleChange = (event, param) => {
    switch (param) {
      case "firstName":
        setFirstName(event.target.value);
        break;
      case "lastName":
        setLastName(event.target.value);
        break;
      case "country":
        setCountry(event.target.value);
        break;
      case "zipCode":
        setZipCode(event.target.value);
        break;
      case "currentCareerLevel":
        setCurrentCareerLevel(event.target.value);
        break;
      default:
        return;
    }
  };

  return (
    <Grid
      container
      justify="center"
      alignContent="center"
      className={classes.root}
    >
      <Grid item xs={12} sm={10} md={8}>
        <Paper className={classes.paper}>
          <Grid container spacing={2} justify="center" alignContent="center">
            <Grid item xs={12}>
              <Typography className={classes.title} variant="h4">
                Account Information
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
                    value={firstName}
                    fullWidth
                    onChange={e => handleChange(e, "firstName")}
                  />
                </Grid>
                {/* Last Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="lastName"
                    className={classes.textField}
                    label="Last Name"
                    variant="standard"
                    value={lastName}
                    fullWidth
                    onChange={e => handleChange(e, "lastName")}
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
                      value={country}
                      onChange={e => handleChange(e, "country")}
                      labelWidth={labelWidth}
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
                    value={zipCode}
                    onChange={e => handleChange(e, "zipCode")}
                    fullWidth
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
                      value={currentCareerLevel}
                      onChange={e => handleChange(e, "currentCareerLevel")}
                      labelWidth={labelWidth}
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
                          <Typography
                            variant="h6"
                            className={classes.purpleText}
                          >
                            Upload Your Resume Here
                          </Typography>
                        </Grid>
                        <Grid item>
                          {" "}
                          <Typography variant="subtitle2" color="textSecondary">
                            (Only *.pdf images will be accepted)
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <ul>{acceptedFilesItems}</ul>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                {/* Update Profile Button */}
                <Grid item xs={12}>
                  <GradientButton
                    text="UPDATE"
                    labelName="updateProfile"
                    size="large"
                    onClick={() => console.log("update")}
                  />
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
    minHeight: "100vh"
  },
  paper: {
    padding: theme.spacing(4, 2),
    boxShadow: shadows.purpleShadow
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
