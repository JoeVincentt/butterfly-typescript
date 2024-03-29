import React, { useState, useContext, useEffect, Suspense } from "react";
import { useSnackbar } from "notistack";
import { Helmet } from "react-helmet";
import firebase from "firebase/app";
import { Link, withRouter } from "react-router-dom";
import {
  TextField,
  Grid,
  Zoom,
  Typography,
  Checkbox,
  LinearProgress
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { FormControlLabel, Paper } from "@material-ui/core";

import { UserDispatchContext } from "../../../StateManagement/UserState";

import GradientButton from "../../Buttons/GradientButton";
import { emailRegex, mediumStrengthPasswordRegex } from "../../utils/regex";

const SignUp = props => {
  const classes = useStyles();
  const db = firebase.firestore();

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useContext(UserDispatchContext);

  //State components
  const [zoomIn, setZoomIn] = useState(false);
  const [loading, setLoading] = useState(false);

  //State Sets
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [subscribeEmail, setSubscribeEmail] = useState(true);
  const [
    termsConditionsPrivacyPolicy,
    setTermsConditionsPrivacyPolicy
  ] = useState(false);

  //State validation
  //Empty
  //Validation
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordIsTooWeak, setPasswordIsTooWeak] = useState(false);
  const [passwordDoesNotMatch, setPasswordDoesNotMatch] = useState(false);
  //SignIN Error
  const [signInError, setSignInError] = useState(false);
  const [signInErrorMessage, setSignInErrorMessage] = useState("");
  //SignUP Error
  const [signUpError, setSignUpError] = useState(false);
  const [signUpErrorMessage, setSignUpErrorMessage] = useState("");

  //ComponentDidMount
  useEffect(() => {
    setZoomIn(true);
    return () => setZoomIn(false);
  }, []);

  //Validate form state callback
  useEffect(() => {
    EmailAndPasswordValidation();
  }, [email, password]);

  //Change Handlers
  const handleSubscribeToEmails = () => setSubscribeEmail(!subscribeEmail);
  const handleTermsConditionsPrivacyPolicy = () =>
    setTermsConditionsPrivacyPolicy(!termsConditionsPrivacyPolicy);
  const handleFirstNameChange = e =>
    setFirstName(e.target.value.replace(/[^a-zA-Z]/g, ""));

  const handleLastNameChange = e =>
    setLastName(e.target.value.replace(/[^a-zA-Z]/g, ""));

  const handleEmailChange = e => setEmail(e.target.value);

  const handlePasswordChange = e => setPassword(e.target.value);

  const handlePasswordConfirmationChange = e =>
    setPasswordConfirmation(e.target.value);

  const clearSignUpForm = () => {
    setSubscribeEmail(true);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
  };

  const EmailAndPasswordValidation = () => {
    //Validate inputs
    let validateEmail = emailRegex.test(email.toLowerCase());
    let validatePasswordStrength = mediumStrengthPasswordRegex.test(
      password.trim()
    );
    //Set Validation state
    setEmailInvalid(!validateEmail);
    setPasswordIsTooWeak(!validatePasswordStrength);
  };

  const formValidation = () => {
    //Validate inputs

    let passwordConfirmationMatch =
      password.trim() === passwordConfirmation.trim();
    let validFirstName = firstName.trim().length > 1;
    let validLastName = lastName.trim().length > 1;

    //Set Validation state
    setPasswordDoesNotMatch(!passwordConfirmationMatch);
    if (
      !emailInvalid &&
      !passwordIsTooWeak &&
      !passwordDoesNotMatch &&
      validFirstName &&
      validLastName &&
      termsConditionsPrivacyPolicy
    ) {
      return true;
    } else {
      return false;
    }
  };

  const signUp = () => {
    setLoading(true);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        setSignUpError(false);
        signIn();
      })
      .catch(error => {
        // Handle Errors here.
        setSignUpError(true);
        setSignUpErrorMessage(error.message);
        setLoading(false);
        enqueueSnackbar("Oops! Something went wrong! Please try again.", {
          variant: "error"
        });
      });
  };

  const signIn = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async () => {
        setSignInError(false);
        const { uid } = await firebase.auth().currentUser;
        await createDatabaseInstanceOfTheUser(uid);
        dispatch({
          type: "login",
          payload: {
            uid: uid,
            firstName: firstName,
            lastName: lastName,
            email: email,
            country: "",
            zipCode: "",
            timezone: "",
            yearsOfExperience: "",
            resume: "",
            role: "user",
            jobsApplied: []
          }
        });
        setLoading(false);
        enqueueSnackbar("Logged In.", {
          variant: "success"
        });
        props.history.push("/");
      })
      .catch(error => {
        // Handle Errors here.
        setSignInError(true);
        setSignInErrorMessage(error.message);
        setLoading(false);
        enqueueSnackbar("Oops! Something went wrong! Please try again.", {
          variant: "error"
        });
      });
  };
  const createDatabaseInstanceOfTheUser = async uid => {
    try {
      if (subscribeEmail) {
        await db
          .collection("subscriptions")
          .doc(uid)
          .set({
            email: email
          });
      }
      await db
        .collection("dashboardStats")
        .doc(uid)
        .set({
          employerStats: {
            jobsPosted: 0,
            totalApplicants: 0,
            newApplicants: 0
          },
          employeeStats: {
            totalApplications: 0
          }
        });
      await db
        .collection("users")
        .doc(uid)
        .set({
          uid: uid,
          firstName: firstName,
          lastName: lastName,
          email: email,
          country: "",
          zipCode: "",
          timezone: "",
          yearsOfExperience: "",
          resume: "",
          role: "user",
          jobsApplied: []
        });
    } catch (error) {
      enqueueSnackbar("Oops! Something went wrong! Please try again.", {
        variant: "error"
      });
    }
  };

  const createNewUserWithEmailAndPassword = async () => {
    await signUp();
    //Clearing Form
    clearSignUpForm();
  };

  const handleSubmit = () => {
    let valid = formValidation();
    if (valid) {
      createNewUserWithEmailAndPassword();
    } else {
      enqueueSnackbar("Please fill-up all the required fields.", {
        variant: "error"
      });
      return;
    }
  };

  const renderSingUpError = () => {
    if (signUpError) {
      return (
        <Typography variant="caption" className={classes.errorMessage}>
          {signUpErrorMessage}
        </Typography>
      );
    }
  };
  const renderSingInError = () => {
    if (signInError) {
      return (
        <Typography variant="caption" className={classes.errorMessage}>
          {signInErrorMessage}
        </Typography>
      );
    }
  };
  const renderInvalidEmailError = () => {
    if (emailInvalid && email.trim().length > 0) {
      return (
        <Typography variant="caption" className={classes.errorMessage}>
          The email address you entered is invalid. Please enter a valid
          address.
        </Typography>
      );
    }
  };
  const renderPasswordIsTooWeakError = () => {
    if (passwordIsTooWeak && password.trim().length > 0) {
      return (
        <Typography variant="caption" className={classes.errorMessage}>
          The password you entered is too weak. Please choose a stronger
          password.
        </Typography>
      );
    }
  };
  const renderPasswordConfirmationNotMatchError = () => {
    if (passwordDoesNotMatch) {
      return (
        <Typography variant="caption" className={classes.errorMessage}>
          Passwords does not match. Please match your passwords.
        </Typography>
      );
    }
  };

  const renderLoadingBar = () => {
    if (loading) {
      return <LinearProgress />;
    }
  };

  return (
    <Suspense fallback={<LinearProgress />}>
      <React.Fragment>
        <Helmet>
          <title>Sign Up</title>
        </Helmet>
        <Grid container component="main" className={classes.image}>
          <Grid container justify="center" alignItems="center">
            <Zoom
              in={zoomIn}
              style={{ transitionDelay: zoomIn ? "100ms" : "0ms" }}
            >
              <Grid item xs={12} sm={8} md={6} lg={4} xl={4}>
                <Paper className={classes.shadowPaper}>
                  {/* <img src={logo} alt="logo" className={classes.logo} />
              <Typography component="h1" variant="h6">
                Sign Up
              </Typography> */}
                  <form className={classes.form} noValidate>
                    <Grid container spacing={4} direction="row">
                      <Grid item xs={12} sm={6}>
                        <TextField
                          className={classes.textField}
                          variant="standard"
                          margin="normal"
                          required
                          fullWidth
                          id="firstName"
                          label="First Name"
                          name="firstName"
                          autoComplete="firstName"
                          autoFocus
                          disabled={loading}
                          value={firstName}
                          onChange={e => handleFirstNameChange(e)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          className={classes.textField}
                          variant="standard"
                          margin="normal"
                          required
                          fullWidth
                          id="lastName"
                          label="Last Name"
                          name="lastName"
                          autoComplete="lastName"
                          autoFocus
                          disabled={loading}
                          value={lastName}
                          onChange={e => handleLastNameChange(e)}
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      className={classes.textField}
                      variant="standard"
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      disabled={loading}
                      value={email}
                      onChange={e => handleEmailChange(e)}
                    />
                    <TextField
                      className={classes.textField}
                      variant="standard"
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      disabled={loading}
                      value={password}
                      onChange={e => handlePasswordChange(e)}
                    />
                    <TextField
                      className={classes.textField}
                      variant="standard"
                      margin="normal"
                      required
                      fullWidth
                      name="passwordConfirmation"
                      label="Password Confirmation"
                      type="password"
                      id="passwordConfirmation"
                      disabled={loading}
                      value={passwordConfirmation}
                      onChange={e => handlePasswordConfirmationChange(e)}
                    />
                    {renderLoadingBar()}
                    <Grid>
                      <FormControlLabel
                        control={
                          <Checkbox
                            disabled={loading}
                            checked={subscribeEmail}
                            onChange={() => handleSubscribeToEmails()}
                            value="subscribeEmail"
                            color="primary"
                          />
                        }
                        label="Subscribe for Newsletter"
                        className={classes.checkBox}
                      />
                    </Grid>
                    <Grid>
                      <FormControlLabel
                        control={
                          <Checkbox
                            style={{
                              color: !termsConditionsPrivacyPolicy && "red"
                            }}
                            disabled={loading}
                            checked={termsConditionsPrivacyPolicy}
                            onChange={() =>
                              handleTermsConditionsPrivacyPolicy()
                            }
                            value="termsAndPrivacy"
                            color="primary"
                          />
                        }
                        label="I read and agree on Terms and Conditions & Privacy Policy"
                        className={classes.checkBox}
                      />
                    </Grid>

                    <Grid container direction="column">
                      {renderSingUpError()}
                      {renderSingInError()}
                      {renderInvalidEmailError()}
                      {renderPasswordIsTooWeakError()}
                      {renderPasswordConfirmationNotMatchError()}
                    </Grid>
                    <Grid
                      container
                      direction="column"
                      justify="center"
                      alignItems="center"
                      spacing={2}
                    >
                      <Grid item className={classes.submit}>
                        <GradientButton
                          onClick={() => (loading ? () => {} : handleSubmit())}
                          text="Register"
                          labelName="registerButton"
                          size="large"
                        />
                      </Grid>

                      <Grid item>
                        <Link to="/sign-in">
                          <Typography variant="body2" color="textSecondary">
                            Already have an account? Sign In
                          </Typography>
                        </Link>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Grid>
            </Zoom>
          </Grid>
        </Grid>
      </React.Fragment>
    </Suspense>
  );
};

const useStyles = makeStyles(theme => ({
  image: {
    // height: "100vh",
    // backgroundImage: `url(${signUpImageBackground})`,
    // backgroundRepeat: "no-repeat",
    // backgroundSize: "cover",
    // backgroundPosition: "center",
    // "@media (max-height: 820px)": {
    //   height: "auto"
    // }
  },
  shadowPaper: {
    padding: theme.spacing(4),

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "@media (max-width: 960px)": {
      margin: theme.spacing(1),
      marginTop: theme.spacing(5),
      padding: theme.spacing(2)
    },
    backgroundColor: "rgba(255, 255, 255, 0.7)"
  },
  checkBox: {
    color: "grey"
  },
  textField: {},
  logo: {
    width: "100px",
    height: "auto",
    margin: theme.spacing(2)
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    marginTop: theme.spacing(1)
  },
  errorMessage: {
    color: "red"
  }
}));

export default withRouter(SignUp);
