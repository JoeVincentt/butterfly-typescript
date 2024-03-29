import React, { useState, useContext, useEffect } from "react";

import uuidv4 from "uuid/v4";
import { useSnackbar } from "notistack";
import firebase from "firebase/app";
import "firebase/storage";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Paper,
  Typography,
  IconButton,
  LinearProgress,
  Button,
  InputLabel,
  MenuItem,
  FormControlLabel,
  FormControl,
  Select,
  RadioGroup
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { Add, Remove } from "@material-ui/icons";
import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import ClearAllIcon from "@material-ui/icons/ClearAll";

import StyledRadio from "../../Buttons/StyledRadio";
import { useDropzone } from "react-dropzone";
import {
  PostJobDispatchContext,
  PostJobStateContext
} from "../../../StateManagement/PostJobState";
import { UserStateContext } from "../../../StateManagement/UserState";

import { categoryList } from "../../../AdditionalResources/categoryList";
import colors from "../../../constants/colors";

const JobDescription = () => {
  const classes = useStyles();
  //Use context
  const { uid } = useContext(UserStateContext);
  const dispatch = useContext(PostJobDispatchContext);
  const jobState = useContext(PostJobStateContext);
  //Notifications
  const { enqueueSnackbar } = useSnackbar();
  //Functional State
  const [progress, setProgress] = useState(null);

  //Dropzone
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
    accept: "image/*",
    multiple: false,
    maxSize: 50000,
    onDrop: acceptedFiles =>
      acceptedFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
  });

  // Setting State if Draft Object exists
  useEffect(() => {
    const jobDraft = JSON.parse(localStorage.getItem("jobDraft"));
    if (jobDraft !== null) {
      // console.log(jobDraft);
      dispatch({
        type: "setJobDescription",
        payload: jobDraft
      });
    }
  }, []);

  //Image Upload
  useEffect(() => {
    if (acceptedFiles.length !== 0) {
      dispatch({
        type: "field",
        fieldName: "logo",
        payload: acceptedFiles[0].preview
      });
      uploadToStorage();
      // console.log(acceptedFiles[0].preview);
    }
    if (rejectedFiles.length !== 0) {
      dispatch({
        type: "field",
        fieldName: "logo",
        payload: ""
      });
    }
  }, [acceptedFiles, rejectedFiles]);

  //Data storage Upload File
  const uploadToStorage = () => {
    const date = Date.now();
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef
      .child(`images/${uid}/${acceptedFiles[0].name}-${date}`)
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
          .child("images")
          .child(uid)
          .child(`${acceptedFiles[0].name}-${date}`)
          .getDownloadURL()
          .then(url => {
            // console.log(url);
            dispatch({
              type: "field",
              fieldName: "logo",
              payload: url
            });
            enqueueSnackbar("Image Uploaded.", {
              variant: "success"
            });
          })
          .catch(error => {});
      }
    );
  };

  const clearAllFields = () => {
    dispatch({
      type: "resetJobDescription"
    });
  };

  const addFieldFunc = (fields, fieldName) => {
    dispatch({
      type: "field",
      fieldName: fieldName,
      payload: [...fields, ""]
    });
    // console.log(fields);
  };

  const removeFieldFunc = (fields, fieldName, i) => {
    if (fields.length > 0) {
      const arr = fields.filter((value, index) => index !== fields.length - 1);
      dispatch({
        type: "field",
        fieldName: fieldName,
        payload: [...arr]
      });
    } else {
      return;
    }
  };

  const handleDynamicFieldChange = (e, index, fields, fieldName) => {
    // e.preventDefault();
    let arr = [...fields];
    arr[index] = e.target.value;
    dispatch({
      type: "field",
      fieldName: fieldName,
      payload: [...arr]
    });
    // console.log(fields);
  };

  const renderDynamicFieldName = (name, fields, fieldName) => (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      className={classes.fieldNameContainer}
    >
      <Grid item>
        <Typography variant="body1">{name}</Typography>
      </Grid>
      <Grid item className={classes.addAndRemoveButtonsContainer}>
        {/* Render Remove button only if there is fields */}
        {fields.length > 0 && (
          <IconButton
            className={classes.addNRemoveButtons}
            size="small"
            onClick={() => removeFieldFunc(fields, fieldName)}
          >
            <Remove />
          </IconButton>
        )}

        <IconButton
          className={classes.addNRemoveButtons}
          size="medium"
          onClick={() => addFieldFunc(fields, fieldName)}
        >
          <Add className={classes.addFieldButton} />
        </IconButton>
      </Grid>
    </Grid>
  );

  const renderDynamicFields = (fields, fieldName) =>
    fields.map((field, index) => (
      <Grid
        key={index}
        container
        justify="center"
        alignItems="center"
        direction="row"
      >
        <TextField
          id={uuidv4()}
          className={classes.textField}
          margin="normal"
          variant="outlined"
          fullWidth
          color="primary"
          value={fields[index]}
          onChange={e => handleDynamicFieldChange(e, index, fields, fieldName)}
        />
      </Grid>
    ));

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

  const renderCompanyInformation = () => {
    return (
      <Grid container alignContent="center" justify="center">
        {/* Company Picture */}
        <Grid
          item
          xs={10}
          sm={8}
          md={6}
          className={classes.dragAndDropContainer}
        >
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
                    <CloudUploadOutlinedIcon className={classes.uploadIcon} />
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid
                    container
                    direction="column"
                    justify="center"
                    alignContent="center"
                  >
                    <Typography variant="h6" className={classes.purpleText}>
                      Upload Your Company Picture
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography variant="caption" color="textSecondary">
                    (Recommended size is 100px x 100px, 50KB MAX Size )
                  </Typography>
                </Grid>

                <Grid item>
                  <Grid
                    container
                    direction="column"
                    alignContent="center"
                    justify="center"
                    alignItems="center"
                  >
                    {jobState.logo !== "" && (
                      <img
                        src={jobState.logo}
                        alt="logo"
                        className={classes.bigAvatar}
                      />
                    )}

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

        {/* Company Description */}
        <TextField
          id="companyName"
          className={classes.textField}
          label="Company Name"
          margin="normal"
          variant="outlined"
          fullWidth
          required
          color="primary"
          value={jobState.companyName}
          onChange={e =>
            dispatch({
              type: "field",
              fieldName: "companyName",
              payload: e.target.value
            })
          }
        />
        <TextField
          id="companyLocation"
          className={classes.textField}
          label="Company Location"
          margin="normal"
          variant="outlined"
          fullWidth
          color="primary"
          value={jobState.companyLocation}
          onChange={e =>
            dispatch({
              type: "field",
              fieldName: "companyLocation",
              payload: e.target.value
            })
          }
        />
        <TextField
          id="companyWebsite"
          className={classes.textField}
          label="Website URL (https://www.example.com)"
          margin="normal"
          variant="outlined"
          fullWidth
          color="primary"
          value={jobState.companyWebsite}
          onChange={e =>
            dispatch({
              type: "field",
              fieldName: "companyWebsite",
              payload: e.target.value
            })
          }
        />
        <TextField
          id="companyAbout"
          className={classes.textField}
          label="Company Description"
          margin="normal"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          value={jobState.companyAbout}
          onChange={e =>
            dispatch({
              type: "field",
              fieldName: "companyAbout",
              payload: e.target.value
            })
          }
        />
      </Grid>
    );
  };

  const renderGeneralInformation = () => {
    return (
      <Grid container alignContent="center" justify="center">
        <TextField
          id="title"
          className={classes.textField}
          label="Title"
          margin="normal"
          variant="outlined"
          fullWidth
          required
          color="primary"
          value={jobState.title}
          onChange={e =>
            dispatch({
              type: "field",
              fieldName: "title",
              payload: e.target.value
            })
          }
        />

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel ref={inputLabel} id="category">
            Category
          </InputLabel>
          <Select
            labelId="category"
            id="categoryPick"
            value={jobState.category}
            onChange={e =>
              dispatch({
                type: "field",
                fieldName: "category",
                payload: e.target.value
              })
            }
            labelWidth={labelWidth}
          >
            <MenuItem value="All Other">
              <em>All Other</em>
            </MenuItem>
            {categoryList.map((category, index) => {
              return (
                <MenuItem key={index} value={category.toLocaleLowerCase()}>
                  {category}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <Grid container justify="flex-start" className={classes.radioButtons}>
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={jobState.jobType}
              aria-label="Full-Time"
              name="customized-radios"
              onChange={e =>
                dispatch({
                  type: "field",
                  fieldName: "jobType",
                  payload: e.target.value
                })
              }
            >
              <FormControlLabel
                value="Full-Time"
                control={<StyledRadio />}
                label="Full-Time"
              />

              <FormControlLabel
                value="Part-Time"
                control={<StyledRadio />}
                label="Part-Time"
              />
              <FormControlLabel
                value="Contract"
                control={<StyledRadio />}
                label="Contract"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <TextField
          id="about"
          className={classes.textField}
          label="About"
          margin="normal"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          value={jobState.about}
          onChange={e =>
            dispatch({
              type: "field",
              fieldName: "about",
              payload: e.target.value
            })
          }
        />
      </Grid>
    );
  };

  const renderAdditionalInformation = () => (
    <TextField
      id="additionalInformation"
      className={classes.textField}
      label="Additional Information"
      margin="normal"
      variant="outlined"
      multiline
      rows={4}
      fullWidth
      value={jobState.additionalInformation}
      onChange={e =>
        dispatch({
          type: "field",
          fieldName: "additionalInformation",
          payload: e.target.value
        })
      }
    />
  );
  const renderJobLink = () => (
    <React.Fragment>
      <TextField
        id="externalJobPostingLink"
        className={classes.textField}
        label="Link for Job Application"
        margin="normal"
        variant="outlined"
        fullWidth
        value={jobState.externalJobPostingLink}
        onChange={e =>
          dispatch({
            type: "field",
            fieldName: "externalJobPostingLink",
            payload: e.target.value
          })
        }
      />
      <Typography variant="caption" color="textSecondary">
        **Please note if you're giving external link, the applicant does not
        apply through ButterflyRemote.com, You WON'T be able to track your
        applicants in your Dashboard.
      </Typography>
    </React.Fragment>
  );

  return (
    <Paper className={classes.paper}>
      <Grid container alignContent="center" justify="center">
        <Grid item xs={12} sm={10}>
          <Paper elevation={0} className={classes.innerPaper}>
            <Grid container justify="space-between">
              <Typography
                variant="h4"
                color="primary"
                className={classes.margin}
              >
                Company Details
              </Typography>
              <Button
                color="primary"
                size="small"
                onClick={() => clearAllFields()}
              >
                <ClearAllIcon className={classes.margin} />
                Clear All Fields
              </Button>
            </Grid>
            {renderCompanyInformation()}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={10}>
          <Paper elevation={0} className={classes.innerPaper}>
            <Typography variant="h4" color="primary" className={classes.margin}>
              Position Details
            </Typography>
            {renderGeneralInformation()}
            <Grid
              container
              justify="center"
              alignContent="center"
              className={classes.containerForDynamicFields}
            >
              {/* Job Requirements */}
              {renderDynamicFieldName(
                "Requirements",
                jobState.requirements,
                "requirements"
              )}
              {renderDynamicFields(jobState.requirements, "requirements")}
              {/* Job Responsibilities */}
              {renderDynamicFieldName(
                "Responsibilities",
                jobState.responsibilities,
                "responsibilities"
              )}
              {renderDynamicFields(
                jobState.responsibilities,
                "responsibilities"
              )}

              {/* Education and Experience */}
              {renderDynamicFieldName(
                "Education and Experience",
                jobState.educationAndExperience,
                "educationAndExperience"
              )}
              {renderDynamicFields(
                jobState.educationAndExperience,
                "educationAndExperience"
              )}

              {/* Skills */}
              {renderDynamicFieldName("Skills", jobState.skills, "skills")}
              {renderDynamicFields(jobState.skills, "skills")}

              {/* Compensation && Benefits*/}
              {renderDynamicFieldName(
                "Compensation and Benefits",
                jobState.compensationAndBenefits,
                "compensationAndBenefits"
              )}
              {renderDynamicFields(
                jobState.compensationAndBenefits,
                "compensationAndBenefits"
              )}

              {/* Job Hiring Process Steps  */}
              {renderDynamicFieldName(
                "Hiring Process Steps",
                jobState.hiringProcessSteps,
                "hiringProcessSteps"
              )}
              {renderDynamicFields(
                jobState.hiringProcessSteps,
                "hiringProcessSteps"
              )}

              {/* Additional Information */}
              {renderAdditionalInformation()}

              {/* External Job Posting Link */}
              {renderJobLink()}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(2)
  },
  paper: {
    margin: theme.spacing(2),
    "@media (max-width: 650px)": {
      margin: theme.spacing(0)
    }
  },
  innerPaper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    border: "1px solid rgba(107, 19, 107, 0.2)"
  },
  containerForDynamicFields: {
    marginBottom: theme.spacing(6)
  },
  textField: {
    marginHorizontal: theme.spacing(1),
    maxWidth: "80%",
    "@media (max-width: 650px)": {
      maxWidth: "100%"
    }
  },
  radioButtons: {
    margin: theme.spacing(1),
    maxWidth: "79%",
    "@media (max-width: 650px)": {
      minWidth: "99%"
    }
  },
  formControl: {
    minWidth: "80%",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    "@media (max-width: 650px)": {
      minWidth: "100%"
    }
  },
  addNRemoveButtons: {
    margin: theme.spacing(1)
  },
  fieldNameContainer: {
    marginLeft: "5%",
    marginBottom: -20,
    "@media (max-width: 650px)": {
      marginLeft: 0
    }
  },
  addAndRemoveButtonsContainer: {
    marginRight: "5%",
    "@media (max-width: 650px)": {
      marginRight: -16
    }
  },
  addFieldButton: {
    color: colors.grey,
    backgroundColor: colors.purple,
    borderRadius: "50%"
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
  },
  bigAvatar: {
    margin: theme.spacing(2),
    width: 100,
    height: 100
  }
}));

export default JobDescription;
