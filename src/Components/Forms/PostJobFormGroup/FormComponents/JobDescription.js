import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Grid, Paper, Typography, IconButton } from "@material-ui/core";
import { Add, Remove } from "@material-ui/icons";

import colors from "../../../../constants/colors";
import shadows from "../../../../constants/shadows";

const JobDescription = () => {
  const [highlightsFields, setHighlightsFields] = React.useState([""]);
  const [responsibilityFields, setResponsibilityFields] = React.useState([""]);
  const [
    educationAndExperienceFields,
    setEducationAndExperienceFields
  ] = React.useState([""]);
  const [skillsFields, setSkillsFields] = React.useState([""]);
  const [benefitsFields, setBenefitsFields] = React.useState([""]);

  const classes = useStyles();

  const handleChange = e => {
    e.preventDefault();
  };

  const addFieldFunc = (fields, setFunction) => {
    setFunction([...fields, ""]);
    console.log(fields);
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
    e.preventDefault();
    let arr = fields;
    arr[index] = e.target.value;
    setFunction([...arr]);
    console.log(fields);
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
        {/* Render Remove button opnly if there is fields */}
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
          variant="filled"
          fullWidth
          color="primary"
          value={fields[index]}
          onChange={e =>
            handleDynamicFieldChange(e, index, fields, setFunction)
          }
        />
      </Grid>
    ));

  return (
    <Paper className={classes.paper}>
      <Grid container alignContent="center" justify="center">
        <TextField
          id="title"
          className={classes.textField}
          label="Title"
          margin="normal"
          variant="filled"
          fullWidth
          required
          color="primary"
        />
        <TextField
          id="aboutPosition"
          className={classes.textField}
          label="About Position"
          margin="normal"
          variant="filled"
          multiline
          rows={4}
          fullWidth
        />
        <TextField
          id="companyInformation"
          className={classes.textField}
          label="Company Information"
          margin="normal"
          variant="filled"
          multiline
          rows={4}
          fullWidth
        />
      </Grid>
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
        {renderDynamicFields(responsibilityFields, setResponsibilityFields)}

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
        {renderDynamicFieldName("Benefits", benefitsFields, setBenefitsFields)}
        {renderDynamicFields(benefitsFields, setBenefitsFields)}
      </Grid>
    </Paper>
  );
};

const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(2),
    boxShadow: shadows.purpleShadow
  },
  containerForDynamicFields: {
    marginBottom: theme.spacing(6)
  },
  textField: {
    marginHorizontal: theme.spacing(1),
    maxWidth: "80%"
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
  }
}));

export default JobDescription;
