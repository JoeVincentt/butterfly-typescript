import React, { useContext, useState, useEffect, Fragment } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import uuid from "uuid/v4";
import firebase from "firebase/app";
import "firebase/firestore";
import {
  CardElement,
  injectStripe,
  StripeProvider,
  Elements
} from "react-stripe-elements";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  CircularProgress
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import GradientButton from "../../Buttons/GradientButton";
import { UserStateContext } from "../../../StateManagement/UserState";
import { PostJobStateContext } from "../../../StateManagement/PostJobState";
import {
  PaymentDispatchContext,
  PaymentStateContext
} from "../../../StateManagement/PaymentState";
import ThankYouCard from "./ThankYouCard";

// You can customize your Elements to give it the look and feel of your site.
const createOptions = () => {
  return {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        letterSpacing: "0.025em",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#c23d4b"
      }
    }
  };
};

const _CardForm = props => {
  const classes = useStyles();
  const db = firebase.firestore();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const userState = useContext(UserStateContext);
  const postJobState = useContext(PostJobStateContext);
  const {
    email,
    firstName,
    lastName,
    companyName,
    price,
    paymentSuccess
  } = useContext(PaymentStateContext);
  const dispatch = useContext(PaymentDispatchContext);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch({
      type: "setPayment",
      payload: {
        email: userState.email,
        firstName: userState.firstName,
        lastName: userState.lastName,
        companyName: postJobState.companyName
      }
    });
    return () =>
      dispatch({
        type: "field",
        fieldName: "paymentSuccess",
        payload: false
      });
  }, []);

  const handleChange = ({ error }) => {
    if (error) {
      enqueueSnackbar(`${error.message}`, {
        variant: "error"
      });
    }
  };

  const createToken = e => {
    // e.preventDefault();
    setLoading(true);
    if (props.stripe) {
      props.stripe
        .createToken()
        .then(payload => {
          if (payload.error) {
            enqueueSnackbar("Oops! Something went wrong! Please try again.", {
              variant: "error"
            });
            setLoading(false);
            // console.log(payload.error);
          } else if (payload.token) {
            // console.log("[token]", payload.token);
            handlePaymentRequest(payload.token.id);
          }
        })
        .catch(error => {
          enqueueSnackbar("Oops! Something went wrong! Please try again.", {
            variant: "error"
          });
          setLoading(false);
          // console.log(error);
        });
    } else {
      // console.log("Stripe.js hasn't loaded yet.");
      setLoading(false);
    }
  };

  const handlePaymentRequest = async token => {
    // Example POST method implementation:
    const data = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      companyName: companyName,
      amount: price,
      token: token
    };
    // console.log(data);
    const response = await axios({
      method: "POST",
      url:
        "https://us-central1-butterfly-remote-jobs-dev.cloudfunctions.net/completePaymentWithStripe",
      data: data
    });
    console.log(response);
    if (response.data.success === true) {
      // console.log("success transaction");

      dispatch({
        type: "field",
        fieldName: "paymentSuccess",
        payload: true
      });
      //create database instance
      createDataBaseInstanceOfPostedJob();
      setLoading(false);
    }
    if (response.data.success === false) {
      // console.log("failed transaction");
      enqueueSnackbar("Oops! Something went wrong! Please try again.", {
        variant: "error"
      });
      dispatch({
        type: "field",
        fieldName: "paymentSuccess",
        payload: false
      });
      setLoading(false);
    }
  };

  const createDataBaseInstanceOfPostedJob = () => {
    console.log("create job data");
    const jobID = uuid();
    db.collection("jobs")
      .doc(jobID)
      .set({
        postedBy: userState.uid,
        id: jobID,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        date: Date.now(),
        status: "active",
        advertisementPlan: postJobState.advertisementPlan,
        logo: postJobState.logo,
        companyName: postJobState.companyName,
        companyLocation: postJobState.companyLocation,
        companyWebsite: postJobState.companyWebsite,
        companyAbout: postJobState.companyAbout,
        title: postJobState.title,
        category: postJobState.category,
        jobType: postJobState.jobType,
        about: postJobState.about,
        hiringProcessSteps: postJobState.hiringProcessSteps,
        responsibilities: postJobState.responsibilities,
        educationAndExperience: postJobState.educationAndExperience,
        skills: postJobState.skills,
        compensationAndBenefits: postJobState.compensationAndBenefits,
        additionalInformation: postJobState.additionalInformation
      })
      .then(() => {
        enqueueSnackbar("Congratulations! Job Posted Successfully.", {
          variant: "success"
        });

        setLoading(false);
      })
      .catch(error => {
        enqueueSnackbar("Oops! Something went wrong! Please try again.", {
          variant: "error"
        });
        setLoading(false);
        // setError(true);
        // console.log(error);
      });

    //UPDATE EMPLOYER DASHBOARD STATS
    db.collection("dashboardStats")
      .doc(userState.uid)
      .update({
        "employerStats.jobsPosted": firebase.firestore.FieldValue.increment(1)
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch(error => {
        console.log("Error updating document:", error);
      });

    //CREATE JOB STATS INSTANCE
    db.collection("jobStats")
      .doc(userState.uid)
      .collection("jobStats")
      .doc(jobID)
      .set({
        id: jobID,
        status: "active",
        logo: postJobState.logo,
        title: postJobState.title,
        views: 0,
        applied: 0
      });
  };

  if (paymentSuccess) {
    return <ThankYouCard />;
  } else {
    return (
      <div>
        <Grid container justify="flex-end" alignContent="center">
          <Grid item>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="flex-end"
              alignContent="flex-end"
              spacing={1}
            >
              <Grid item>
                <Typography variant="subtitle1">Total Price:</Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6">{price}$</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="firstName"
              className={classes.textField}
              label="First Name"
              margin="normal"
              variant="standard"
              fullWidth
              required
              disabled={loading}
              value={firstName}
              onChange={e =>
                dispatch({
                  type: "field",
                  fieldName: "firstName",
                  payload: e.target.value
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="lastName"
              className={classes.textField}
              label="Last Name"
              margin="normal"
              variant="standard"
              fullWidth
              required
              disabled={loading}
              value={lastName}
              onChange={e =>
                dispatch({
                  type: "field",
                  fieldName: "lastName",
                  payload: e.target.value
                })
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              id="companyName"
              className={classes.textField}
              label="Company Name"
              margin="normal"
              variant="standard"
              fullWidth
              required
              disabled={loading}
              value={companyName}
              onChange={e =>
                dispatch({
                  type: "field",
                  fieldName: "companyName",
                  payload: e.target.value
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="Email"
              className={classes.textField}
              label="Email"
              margin="normal"
              variant="standard"
              fullWidth
              required
              disabled={loading}
              value={email}
              onChange={e =>
                dispatch({
                  type: "field",
                  fieldName: "email",
                  payload: e.target.value
                })
              }
            />
          </Grid>
        </Grid>

        <Grid>
          <Typography variant="h6" className={classes.spacing}>
            Card Details
          </Typography>
          <CardElement onChange={handleChange} {...createOptions()} />
        </Grid>

        <Grid container justify="center" alignContent="center">
          <Grid item className={classes.button}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Fragment>
                {!paymentSuccess && (
                  <GradientButton
                    text="Submit Payment"
                    size="large"
                    labelName="stripePay"
                    onClick={() => createToken()}
                  />
                )}
              </Fragment>
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
};

const CardForm = injectStripe(_CardForm);

const Payment = props => {
  const classes = useStyles();
  return (
    <Grid container justify="center" alignContent="center">
      <Grid item xs={12} sm={8}>
        <Paper className={classes.paper}>
          <StripeProvider apiKey={"pk_test_RppBJ2eaykT7fLU90EHShe43004Fx31yx1"}>
            <Elements>
              <CardForm
              //  handleResult={props.handleResult}
              />
            </Elements>
          </StripeProvider>
        </Paper>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(1)
  },

  button: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2)
  },
  spacing: {
    margin: theme.spacing(4, 0)
  },

  textField: {}
}));

export default Payment;
