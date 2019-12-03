import React, { useState, useContext, useEffect } from "react";
import uuidv4 from "uuid/v4";
import firebase from "firebase/app";
import "firebase/storage";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import {
  Grid,
  Paper,
  Typography,
  IconButton,
  LinearProgress,
  Button
} from "@material-ui/core";
import { Add, Remove } from "@material-ui/icons";
import CloudUploadOutlinedIcon from "@material-ui/icons/CloudUploadOutlined";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useDropzone } from "react-dropzone";
import { PostJobDispatchContext } from "../../../../StateManagement/PostJobState";
import { UserStateContext } from "../../../../StateManagement/UserState";

import { categoryList } from "../../../../MockUpData/categoryList";

import colors from "../../../../constants/colors";
import shadows from "../../../../constants/shadows";

const JobDescription = () => {
  const classes = useStyles();
  //Use context
  const { uid } = useContext(UserStateContext);
  const dispatch = useContext(PostJobDispatchContext);

  //Company Info State
  const [logo, setLogo] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyAbout, setCompanyAbout] = useState("");

  //Position Description State
  const [title, setTitle] = useState("");
  const [category, setCategory] = React.useState("");
  const [fullTimePosition, setFullTimePosition] = useState(false);
  const [partTimePosition, setPartTimePosition] = useState(false);
  const [contractPosition, setContractPosition] = useState(false);
  const [about, setAbout] = useState("");
  const [highlightsFields, setHighlightsFields] = useState([""]);
  const [responsibilityFields, setResponsibilityFields] = useState([""]);
  const [
    educationAndExperienceFields,
    setEducationAndExperienceFields
  ] = useState([""]);
  const [skillsFields, setSkillsFields] = useState([""]);
  const [benefitsFields, setBenefitsFields] = useState([""]);
  const [compensationFields, setCompensationFields] = useState([""]);
  const [additionalInformation, setAdditionalInformation] = useState("");

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
    maxSize: 500000,
    onDrop: acceptedFiles =>
      acceptedFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
  });

  //Setting State if Draft Object exists
  useEffect(() => {
    const jobDraft = JSON.parse(localStorage.getItem("jobDraft"));
    if (jobDraft !== null) {
      const {
        logo,
        companyName,
        companyLocation,
        companyWebsite,
        companyAbout,
        title,
        category,
        fullTimePosition,
        partTimePosition,
        contractPosition,
        about,
        highlights,
        responsibilities,
        educationAndExperience,
        skills,
        benefits,
        compensation,
        additionalInformation
      } = jobDraft;
      setLogo(logo);
      setCompanyName(companyName);
      setCompanyLocation(companyLocation);
      setCompanyWebsite(companyWebsite);
      setCompanyAbout(companyAbout);
      setTitle(title);
      setCategory(category);
      setFullTimePosition(fullTimePosition);
      setPartTimePosition(partTimePosition);
      setContractPosition(contractPosition);
      setAbout(about);
      setHighlightsFields(highlights);
      setResponsibilityFields(responsibilities);
      setEducationAndExperienceFields(educationAndExperience);
      setSkillsFields(skills);
      setBenefitsFields(benefits);
      setCompensationFields(compensation);
      setAdditionalInformation(additionalInformation);

      dispatch({
        type: "setJobDescription",
        payload: jobDraft
      });
    }
  }, []);

  //Setting Global State And Local Storage Draft Object
  useEffect(() => {
    let jobDraft = {
      logo: logo,
      companyName: companyName,
      companyLocation: companyLocation,
      companyWebsite: companyWebsite,
      companyAbout: companyAbout,
      title: title,
      category: category,
      fullTimePosition: fullTimePosition,
      partTimePosition: partTimePosition,
      contractPosition: contractPosition,
      about: about,
      highlights: highlightsFields,
      responsibilities: responsibilityFields,
      educationAndExperience: educationAndExperienceFields,
      skills: skillsFields,
      benefits: benefitsFields,
      compensation: compensationFields,
      additionalInformation: additionalInformation
    };
    localStorage.setItem("jobDraft", JSON.stringify(jobDraft));
    dispatch({
      type: "setJobDescription",
      payload: jobDraft
    });
  }, [
    logo,
    companyName,
    companyLocation,
    companyWebsite,
    companyAbout,
    title,
    category,
    fullTimePosition,
    partTimePosition,
    contractPosition,
    about,
    highlightsFields,
    responsibilityFields,
    educationAndExperienceFields,
    skillsFields,
    benefitsFields,
    compensationFields,
    additionalInformation
  ]);

  //Image Upload
  useEffect(() => {
    if (acceptedFiles.length !== 0) {
      setLogo(acceptedFiles[0].preview);
      uploadToStorage();
      // console.log(acceptedFiles[0].preview);
    }
    if (rejectedFiles.length !== 0) {
      setLogo("");
    }
  }, [acceptedFiles, rejectedFiles]);

  //Data storage Upload File
  const uploadToStorage = () => {
    const storageRef = firebase.storage().ref();
    const uploadTask = storageRef
      .child(`images/${uid}/${acceptedFiles[0].name}`)
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
          .child(acceptedFiles[0].name)
          .getDownloadURL()
          .then(url => {
            // console.log(url);
            setLogo(url);
          })
          .catch(error => {});
      }
    );
  };

  const clearAllFields = () => {
    setLogo("");
    setCompanyName("");
    setCompanyLocation("");
    setCompanyWebsite("");
    setCompanyAbout("");
    setTitle("");
    setCategory("");
    setFullTimePosition(false);
    setPartTimePosition(false);
    setContractPosition(false);
    setAbout("");
    setHighlightsFields([""]);
    setResponsibilityFields([""]);
    setEducationAndExperienceFields([""]);
    setSkillsFields([""]);
    setBenefitsFields([""]);
    setCompensationFields([""]);
    setAdditionalInformation("");
  };

  const addFieldFunc = (fields, setFunction) => {
    setFunction([...fields, ""]);
    // console.log(fields);
  };

  const removeFieldFunc = (fields, setFunction, i) => {
    if (fields.length > 0) {
      const arr = fields.filter((value, index) => index !== fields.length - 1);
      setFunction([...arr]);
    } else {
      return;
    }
  };

  const handleDynamicFieldChange = (e, index, fields, setFunction) => {
    // e.preventDefault();
    let arr = [...fields];
    arr[index] = e.target.value;
    setFunction([...arr]);
    // console.log(fields);
  };

  const renderDynamicFieldName = (name, fields, setFunction) => (
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
            onClick={() => removeFieldFunc(fields, setFunction)}
          >
            <Remove />
          </IconButton>
        )}

        <IconButton
          className={classes.addNRemoveButtons}
          size="medium"
          onClick={() => addFieldFunc(fields, setFunction)}
        >
          <Add className={classes.addFieldButton} />
        </IconButton>
      </Grid>
    </Grid>
  );

  const renderDynamicFields = (fields, setFunction) =>
    fields.map((field, index) => (
      <Grid
        key={index}
        container
        justify="center"
        alignItems="center"
        direction="row"
      >
        <TextField
          id={index.toString()}
          className={classes.textField}
          margin="normal"
          variant="outlined"
          fullWidth
          color="primary"
          value={fields[index]}
          onChange={e =>
            handleDynamicFieldChange(e, index, fields, setFunction)
          }
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
        <Grid item xs={10} sm={6} className={classes.dragAndDropContainer}>
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
                  <Typography variant="subtitle2" color="textSecondary">
                    (Recommended size is 100px x 100px, 500KB MAX Size )
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
                    {logo !== "" && (
                      <img
                        src={logo}
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
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
        />
        <TextField
          id="companyLocation"
          className={classes.textField}
          label="Company Location"
          margin="normal"
          variant="outlined"
          fullWidth
          color="primary"
          value={companyLocation}
          onChange={e => setCompanyLocation(e.target.value)}
        />
        <TextField
          id="companyWebsite"
          className={classes.textField}
          label="Website URL (https://www.example.com)"
          margin="normal"
          variant="outlined"
          fullWidth
          color="primary"
          value={companyWebsite}
          onChange={e => setCompanyWebsite(e.target.value)}
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
          value={companyAbout}
          onChange={e => setCompanyAbout(e.target.value)}
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
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel ref={inputLabel} id="category">
            Category
          </InputLabel>
          <Select
            labelId="category"
            id="categoryPick"
            value={category}
            onChange={e => setCategory(e.target.value)}
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

        <Grid container justify="flex-start" style={{ maxWidth: "80%" }}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={fullTimePosition}
                  onChange={() => setFullTimePosition(!fullTimePosition)}
                  value="full-time"
                  color="primary"
                />
              }
              label="Full-Time"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={partTimePosition}
                  onChange={() => setPartTimePosition(!partTimePosition)}
                  value="part-time"
                  color="primary"
                />
              }
              label="Part-Time"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={contractPosition}
                  onChange={() => setContractPosition(!contractPosition)}
                  value="contract"
                  color="primary"
                />
              }
              label="Contract"
            />
          </FormGroup>
        </Grid>

        <TextField
          id="aboutPosition"
          className={classes.textField}
          label="About"
          margin="normal"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          value={about}
          onChange={e => setAbout(e.target.value)}
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
      value={additionalInformation}
      onChange={e => setAdditionalInformation(e.target.value)}
    />
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
              {/* Job Highlights */}
              {renderDynamicFieldName(
                "Job Highlights",
                highlightsFields,
                setHighlightsFields
              )}
              {renderDynamicFields(highlightsFields, setHighlightsFields)}

              {/* Job Responsibilities */}
              {renderDynamicFieldName(
                "Responsibilities",
                responsibilityFields,
                setResponsibilityFields
              )}
              {renderDynamicFields(
                responsibilityFields,
                setResponsibilityFields
              )}

              {/* Education and Experience */}
              {renderDynamicFieldName(
                "Education and Experience",
                educationAndExperienceFields,
                setEducationAndExperienceFields
              )}
              {renderDynamicFields(
                educationAndExperienceFields,
                setEducationAndExperienceFields
              )}

              {/* Skills */}
              {renderDynamicFieldName("Skills", skillsFields, setSkillsFields)}
              {renderDynamicFields(skillsFields, setSkillsFields)}

              {/* Benefits */}
              {renderDynamicFieldName(
                "Benefits",
                benefitsFields,
                setBenefitsFields
              )}
              {renderDynamicFields(benefitsFields, setBenefitsFields)}

              {/* Compensation */}
              {renderDynamicFieldName(
                "Compensation",
                compensationFields,
                setCompensationFields
              )}
              {renderDynamicFields(compensationFields, setCompensationFields)}

              {/* Additional Information */}
              {renderAdditionalInformation()}
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
    boxShadow: shadows.purpleShadow
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
    maxWidth: "80%"
  },
  formControl: {
    minWidth: "80%",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  addNRemoveButtons: {
    margin: theme.spacing(1)
  },
  fieldNameContainer: {
    marginLeft: "5%",
    marginBottom: -20
  },
  addAndRemoveButtonsContainer: {
    marginRight: "5%"
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
