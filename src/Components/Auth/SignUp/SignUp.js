import React from "react";
import firebase from "firebase/app";
import { Link, withRouter } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Zoom from "@material-ui/core/Zoom";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { FormControlLabel } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";

import GradientButton from "../../Buttons/GradientButton";
import { emailRegex, mediumStrengthPasswordRegex } from "../../utils/regex";
import logo from "../../../images/logo.png";

import "./SignUp.css";

import signUpImageBackground from "../../../images/signUpInBackground.jpeg";

const SignUp = props => {
  const classes = useStyles();
  const db = firebase.firestore();

  //State components
  const [zoomIn, setZoomIn] = React.useState(false);

  //State Sets
  const [firstName, setFirstName] = React.useState("John");
  const [lastName, setLastName] = React.useState("Doe");
  const [email, setEmail] = React.useState("eugene.bb@hotmail.com");
  const [password, setPassword] = React.useState("12345a");
  const [passwordConfirmation, setPasswordConfirmation] = React.useState(
    "12345a"
  );
  const [subscribeEmail, setSubscribeEmail] = React.useState(true);

  //State validation
  const [emailInvalid, setEmailInvalid] = React.useState(true);
  const [passwordIsTooWeak, setPasswordIsTooWeak] = React.useState(true);
  const [passwordDoesNotMatch, setPasswordDoesNotMatch] = React.useState(true);
  //SignIN Error
  const [signInError, setSignInError] = React.useState(false);
  const [signInErrorCode, setSignInErrorCode] = React.useState("");
  const [signInErrorMessage, setSignInErrorMessage] = React.useState("");
  //SignUP Error
  const [signUpError, setSignUpError] = React.useState(false);
  const [signUpErrorCode, setSignUpErrorCode] = React.useState("");
  const [signUpErrorMessage, setSignUpErrorMessage] = React.useState("");

  //ComponentDidMount
  React.useEffect(() => {
    setZoomIn(true);
    return () => setZoomIn(false);
  }, []);

  //Validate form state callback
  React.useEffect(() => {
    formValidation();
  }, [
    email,
    password,
    passwordConfirmation,
    subscribeEmail,
    lastName,
    firstName
  ]);

  //Change Handlers
  const handleSubscribeToEmails = () => setSubscribeEmail(!subscribeEmail);
  const handleFirstNameChange = e => setFirstName(e.target.value);
  const handleLastNameChange = e => setLastName(e.target.value);
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

  const formValidation = () => {
    //Validate inputs
    let validateEmail = emailRegex.test(email.toLowerCase());
    let validatePasswordStrength = mediumStrengthPasswordRegex.test(
      password.trim()
    );
    let passwordConfirmationMatch =
      password.trim() === passwordConfirmation.trim();
    let validFirstName = firstName.trim().length > 1;
    let validLastName = lastName.trim().length > 1;

    //Set Validation state
    setEmailInvalid(!validateEmail);
    setPasswordIsTooWeak(!validatePasswordStrength);
    setPasswordDoesNotMatch(!passwordConfirmationMatch);

    if (
      !emailInvalid &&
      !passwordIsTooWeak &&
      !passwordDoesNotMatch &&
      validFirstName &&
      validLastName
    ) {
      // console.log("good to go");
      return true;
    } else {
      // console.log(email, "email valid", validateEmail, "invalid", emailInvalid);
      // console.log(
      //   password,
      //   "password strength valid",
      //   validatePasswordStrength,
      //   "too weak",
      //   passwordIsTooWeak
      // );
      // console.log(
      //   passwordConfirmation,
      //   "matching",
      //   passwordConfirmationMatch,
      //   "does NOT match",
      //   passwordDoesNotMatch
      // );
      return false;
    }
  };

  const signUp = () =>
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
        setSignUpErrorCode(error.code);
        setSignUpErrorMessage(error.message);
      });

  const signIn = () =>
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setSignInError(false);
        createDatabaseInstanceOfTheUser();
        props.history.push("/");
      })
      .catch(error => {
        // Handle Errors here.
        setSignInError(true);
        setSignInErrorCode(error.code);
        setSignInErrorMessage(error.message);
      });

  const createDatabaseInstanceOfTheUser = async () => {
    const { uid } = await firebase.auth().currentUser;
    if (subscribeEmail) {
      db.collection("subscriptions")
        .doc(uid)
        .set({
          email: email
        })
        .catch(error => {});
    }
    db.collection("users")
      .doc(uid)
      .set({
        uid: uid,
        firstName: firstName,
        lastName: lastName,
        email: email
      })
      .catch(error => {});
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

  return (
    <Grid container component="main" className={classes.image}>
      <Grid container direction="column" justify="center" alignItems="center">
        <Zoom in={zoomIn} style={{ transitionDelay: zoomIn ? "100ms" : "0ms" }}>
          <Grid item xs={12}>
            <div className={classes.shadowPaper}>
              <img src={logo} alt="logo" className={classes.logo} />

              <Typography component="h1" variant="h6">
                Sign Up
              </Typography>
              <form className={classes.form} noValidate>
                <Grid container spacing={4} direction="row">
                  <Grid item xs={6}>
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
                      value={firstName}
                      onChange={e => handleFirstNameChange(e)}
                    />
                  </Grid>
                  <Grid item xs={6}>
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
                  value={passwordConfirmation}
                  onChange={e => handlePasswordConfirmationChange(e)}
                />
                <Grid>
                  <FormControlLabel
                    control={
                      <Checkbox
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
                <Grid container direction="column">
                  {renderSingUpError()}
                  {renderSingInError()}
                  {renderInvalidEmailError()}
                  {renderPasswordIsTooWeakError()}
                  {renderPasswordConfirmationNotMatchError()}
                </Grid>

                <Grid item className={classes.submit}>
                  <GradientButton
                    onClick={() => handleSubmit()}
                    text="Register"
                    labelName="registerButton"
                    size="large"
                  />
                </Grid>
                <Grid container>
                  <Grid item>
                    <Link to="/sign-in" style={{ textDecoration: "none" }}>
                      <Typography variant="body2" color="textSecondary">
                        Already have an account? Sign In
                      </Typography>
                    </Link>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Grid>
        </Zoom>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  image: {
    height: "100vh",
    backgroundImage: `url(${signUpImageBackground})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    "@media (max-height: 820px)": {
      height: "auto"
    }
  },
  shadowPaper: {
    padding: theme.spacing(4),
    margin: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "@media (max-width: 960px)": {
      margin: theme.spacing(1),
      marginTop: theme.spacing(5),
      padding: theme.spacing(2)
    },
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    boxShadow: "0 0 200px 0px rgba(70, 9, 125, 0.33)"
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
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  errorMessage: {
    color: "red"
  }
}));

export default withRouter(SignUp);
