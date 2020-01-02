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
  CircularProgress,
  Button
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "./StripeOverride.css";

import GradientButton from "../../Buttons/GradientButton";
import { UserStateContext } from "../../../StateManagement/UserState";
import { PostJobStateContext } from "../../../StateManagement/PostJobState";
import {
  PaymentDispatchContext,
  PaymentStateContext
} from "../../../StateManagement/PaymentState";
import ThankYouCard from "./ThankYouCard";

import { emailRegex } from "../../utils/regex";

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

  const { enqueueSnackbar } = useSnackbar();

  const userState = useContext(UserStateContext);
  const postJobState = useContext(PostJobStateContext);
  const {
    email,
    firstName,
    lastName,
    companyName,
    price,
    paymentSuccess,
    promoCode
  } = useContext(PaymentStateContext);
  const dispatch = useContext(PaymentDispatchContext);

  const [loading, setLoading] = useState(false);
  const [promoCodeToCheck, setPromoCodeToCheck] = useState("");

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
    return () => {
      dispatch({
        type: "field",
        fieldName: "paymentSuccess",
        payload: false
      });
      dispatch({
        type: "field",
        fieldName: "promoCode",
        payload: ""
      });
    };
  }, []);

  const applyPromoCode = async () => {
    if (promoCodeToCheck.trim().length < 8) {
      enqueueSnackbar("Please Enter Valid Promo Code.", {
        variant: "error"
      });
    } else if (promoCode !== "") {
      enqueueSnackbar("Only One Promo Code Can be Applied.", {
        variant: "error"
      });
    } else {
      try {
        const document = await db
          .collection("coupons")
          .doc(promoCodeToCheck)
          .get();
        if (document.exists) {
          const coupon = document.data();
          if (coupon.expiration < Date.now() + 3600000) {
            enqueueSnackbar("Promo Code is Expired.", {
              variant: "error"
            });
            setPromoCodeToCheck("");
          } else {
            const discountedPrice = price - (price * coupon.discount) / 100;
            dispatch({
              type: "field",
              fieldName: "price",
              payload: discountedPrice
            });
            dispatch({
              type: "field",
              fieldName: "promoCode",
              payload: promoCodeToCheck
            });
            enqueueSnackbar("Promo Code Applied.", {
              variant: "success"
            });
          }
          // console.log(document.data());
        } else {
          enqueueSnackbar("Please Enter Valid Promo Code.", {
            variant: "error"
          });
          setPromoCodeToCheck("");
        }
      } catch (error) {
        enqueueSnackbar("Oops! Something went wrong! Please try again.", {
          variant: "error"
        });
      }
    }
  };

  const handleCardNumberChangeInput = ({ error }) => {
    if (error) {
      enqueueSnackbar(`${error.message}`, {
        variant: "error"
      });
    }
  };

  const validateEmail = () => {
    return emailRegex.test(email.toLowerCase());
  };
  const paymentFormCheck = () => {
    if (
      email.trim().length <= 0 ||
      firstName.trim().length <= 0 ||
      lastName.trim().length <= 0 ||
      companyName.trim().length <= 0 ||
      validateEmail() === false
    ) {
      return false;
    } else {
      return true;
    }
  };

  const createToken = async e => {
    // e.preventDefault();
    if (paymentFormCheck() === false) {
      enqueueSnackbar("Oops! Please fill-up all the fields.", {
        variant: "error"
      });
    } else {
      setLoading(true);
      if (props.stripe) {
        try {
          const payload = await props.stripe.createToken();
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
        } catch (error) {
          enqueueSnackbar("Oops! Something went wrong! Please try again.", {
            variant: "error"
          });
          setLoading(false);
        }
      } else {
        // console.log("Stripe.js hasn't loaded yet.");
        enqueueSnackbar("Oops! Something went wrong! Please try again.", {
          variant: "error"
        });
        setLoading(false);
      }
    }
  };

  const handlePaymentRequest = async token => {
    //Cloud Function To Execute
    let url;
    if (process.env.NODE_ENV === "production") {
      url =
        "https://us-central1-butterfly-remote-jobs-prod.cloudfunctions.net/completePaymentWithStripe";
    } else {
      url =
        "https://us-central1-butterfly-remote-jobs-dev.cloudfunctions.net/completePaymentWithStripe";
    }
    const data = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      companyName: companyName,
      amount: price,
      promoCode: promoCode,
      advertisementPlan: postJobState.advertisementPlan,
      token: token
    };

    try {
      const response = await axios({
        method: "POST",
        url: url,
        data: data
      });
      // console.log(response);
      if (response.data.success === true) {
        // console.log("success transaction");
        dispatch({
          type: "field",
          fieldName: "paymentSuccess",
          payload: true
        });
        //create database instance
        createDataBaseInstanceOfPostedJob();
        enqueueSnackbar("Payment Successful", {
          variant: "success"
        });
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
    } catch (error) {
      enqueueSnackbar("Oops! Something went wrong! Please try again.", {
        variant: "error"
      });
    }
  };

  const createDataBaseInstanceOfPostedJob = async () => {
    // console.log("create job data");
    try {
      const jobID = uuid();
      await db
        .collection("jobs")
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
          additionalInformation: postJobState.additionalInformation,
          externalJobPostingLink: postJobState.externalJobPostingLink
        });

      //UPDATE EMPLOYER DASHBOARD STATS
      await db
        .collection("dashboardStats")
        .doc(userState.uid)
        .update({
          "employerStats.jobsPosted": firebase.firestore.FieldValue.increment(1)
        });

      //CREATE JOB STATS INSTANCE
      await db
        .collection("jobStats")
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
      enqueueSnackbar("Great News, Job Posted.", {
        variant: "success"
      });
      setLoading(false);
    } catch (error) {
      enqueueSnackbar("Oops! Something went wrong! Please try again.", {
        variant: "error"
      });
      setLoading(false);
      // setError(true);
      // console.log(error);
    }
  };

  if (paymentSuccess) {
    return <ThankYouCard />;
  } else {
    return (
      <div>
        <Grid container justify="flex-end" alignContent="center">
          <Grid item style={{ paddingBottom: 20 }}>
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

        <Grid container spacing={1}>
          <Grid item>
            <Typography variant="h6">Personal Details</Typography>
          </Grid>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
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
          <Grid item xs={12}>
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
          <Grid item xs={12}>
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
          <Typography variant="h6" className={classes.promoCodeTitleText}>
            Promo Code
          </Typography>
          <Grid container direction="row" alignItems="center" spacing={1}>
            <Grid item xs={10}>
              <TextField
                id="PromoCode"
                className={classes.textField}
                label="Optional"
                margin="normal"
                variant="outlined"
                fullWidth
                disabled={loading || promoCode !== ""}
                value={promoCodeToCheck}
                onChange={e => setPromoCodeToCheck(e.target.value)}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                color="primary"
                size="large"
                disabled={loading || promoCode !== ""}
                onClick={() => applyPromoCode()}
              >
                Apply
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid>
          <Typography variant="h6" className={classes.cardTitleText}>
            Credit or Debit Card
          </Typography>
          <CardElement
            onChange={handleCardNumberChangeInput}
            {...createOptions()}
          />
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
                    onClick={() =>
                      userState.role === "administrator"
                        ? createDataBaseInstanceOfPostedJob()
                        : createToken()
                    }
                  />
                )}
              </Fragment>
            )}
          </Grid>
        </Grid>
        <Grid>
          <Typography
            variant="caption"
            color="textSecondary"
            className={classes.spacing}
          >
            By posting a job you acknowledge that you have read and agreed to
            our{" "}
            <a
              href="https://app.termly.io/document/terms-of-use-for-saas/a5c3ec46-9aa9-4dd6-a400-ad98d3f06924"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms and Conditions
            </a>
            . All sales are final.
          </Typography>
        </Grid>
      </div>
    );
  }
};

const CardForm = injectStripe(_CardForm);

const Payment = props => {
  const classes = useStyles();

  let publicKey;
  if (process.env.NODE_ENV === "production") {
    publicKey = "pk_live_us1NSqxG4k5emLkhJJ19umfR00KkasNTue";
  } else {
    publicKey = "pk_test_RppBJ2eaykT7fLU90EHShe43004Fx31yx1";
  }
  return (
    <Grid container justify="center" alignContent="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper className={classes.paper}>
          <StripeProvider apiKey={publicKey}>
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
  promoCodeTitleText: {
    marginTop: 32,
    marginBottom: -10
  },
  cardTitleText: {
    marginTop: 20,
    marginBottom: 10
  },

  textField: {}
}));

export default Payment;
