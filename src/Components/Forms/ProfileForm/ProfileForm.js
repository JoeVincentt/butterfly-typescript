import React from "react";
import { Grid, Paper, Typography, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

import listOfCountries from "./FormComponents/ListOfCountries";
import listOfCurrentCareerLevel from "./FormComponents/ListOfCurrentCareerLevel";

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
      <Grid item xs={12} sm={8}>
        <Paper className={classes.paper}>
          <Grid container justify="center" alignContent="center">
            <Typography className={classes.title} variant="h6">
              Account Information
            </Typography>
            <Grid item xs={12} sm={10}>
              <Grid container spacing={3}>
                {/* First Name */}
                <Grid item xs={12}>
                  <TextField
                    id="firstName"
                    className={classes.textField}
                    InputLabelProps={{
                      classes: {
                        root: classes.cssLabel,
                        focused: classes.cssFocused
                      }
                    }}
                    InputProps={{
                      classes: {
                        root: classes.cssOutlinedInput,
                        focused: classes.cssFocused,
                        notchedOutline: classes.notchedOutline
                      }
                    }}
                    label="First Name"
                    variant="outlined"
                    value={firstName}
                    fullWidth
                    onChange={e => handleChange(e, "firstName")}
                  />
                </Grid>

                {/* Last Name */}
                <Grid item xs={12}>
                  <TextField
                    id="lastName"
                    className={classes.textField}
                    InputLabelProps={{
                      classes: {
                        root: classes.cssLabel,
                        focused: classes.cssFocused
                      }
                    }}
                    InputProps={{
                      classes: {
                        root: classes.cssOutlinedInput,
                        focused: classes.cssFocused,
                        notchedOutline: classes.notchedOutline
                      }
                    }}
                    label="Last Name"
                    variant="outlined"
                    value={lastName}
                    fullWidth
                    onChange={e => handleChange(e, "lastName")}
                  />
                </Grid>

                {/* Country*/}
                <Grid item xs={12}>
                  <FormControl
                    variant="outlined"
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
                <Grid item xs={12}>
                  <TextField
                    id="zipCode"
                    className={classes.textField}
                    InputLabelProps={{
                      classes: {
                        root: classes.cssLabel,
                        focused: classes.cssFocused
                      }
                    }}
                    InputProps={{
                      classes: {
                        root: classes.cssOutlinedInput,
                        focused: classes.cssFocused,
                        notchedOutline: classes.notchedOutline
                      }
                    }}
                    label="Zip Code"
                    variant="outlined"
                    type="number"
                    value={zipCode}
                    onChange={e => handleChange(e, "zipCode")}
                    fullWidth
                  />
                </Grid>

                {/* Current Career Level */}
                <Grid item xs={12}>
                  <FormControl
                    variant="outlined"
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
                <Grid item xs={12}>
                  <label className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
                    <input
                      type="file"
                      onChange={e => console.log(e.target.value)}
                    />
                    <CloudUploadIcon style={{ marginRight: 10 }} />
                    Resume Upload
                  </label>
                </Grid>

                {/* Update Profile Button */}
                <Grid item xs={10}>
                  <Button variant="contained" color="primary">
                    Update
                  </Button>
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
    height: "100vh"
  },
  title: {
    margin: theme.spacing(2)
  },
  paper: {
    padding: theme.spacing(4, 1)
  },
  formControl: {
    minWidth: "100%"
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  button: {
    padding: theme.spacing(2),
    minWidth: "100%"
  },
  textField: {},
  notchedOutline: {},
  cssLabel: {
    "&$cssFocused": {
      color: "green"
    }
  },
  cssOutlinedInput: {
    "&$cssFocused $notchedOutline": {
      borderColor: "green"
    }
  },
  cssFocused: {},
  notchedOutline: {}
}));

export default ProfileForm;
