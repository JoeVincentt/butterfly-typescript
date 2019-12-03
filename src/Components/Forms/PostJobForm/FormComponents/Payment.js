import React from "react";
import {
  CardElement,
  injectStripe,
  StripeProvider,
  Elements
} from "react-stripe-elements";
import { Grid, Paper, Typography, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import shadows from "../../../../constants/shadows";
import GradientButton from "../../../Buttons/GradientButton";

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
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleChange = ({ error }) => {
    if (error) {
      setErrorMessage(error.message);
    }
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    if (props.stripe) {
      props.stripe.createToken().then(props.handleResult);
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };

  return (
    <div>
      <form onSubmit={() => handleSubmit()}>
        <Grid container direction="column">
          <Grid item>
            <Grid container spacing={2} direction="row" justify="space-between">
              <Grid item xs={6}>
                <TextField
                  id="firstName"
                  className={classes.textField}
                  label="First Name"
                  margin="normal"
                  variant="filled"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="lastName"
                  className={classes.textField}
                  label="Last Name"
                  margin="normal"
                  variant="filled"
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <TextField
              id="companyName"
              className={classes.textField}
              label="Company Name"
              margin="normal"
              variant="filled"
              fullWidth
              required
            />
          </Grid>
          <Grid item>
            <TextField
              id="address"
              className={classes.textField}
              label="Address"
              margin="normal"
              variant="filled"
              fullWidth
              required
            />
          </Grid>
        </Grid>

        <Grid>
          <Typography variant="h6" className={classes.spacing}>
            Card Details
          </Typography>
          <CardElement onChange={handleChange} {...createOptions()} />
          <div className="error" role="alert">
            {errorMessage}
          </div>
        </Grid>

        <Grid container justify="space-between" alignContent="center">
          <Grid item className={classes.button}>
            <GradientButton
              text="Submit Payment"
              size="large"
              labelName="stripePay"
              onClick={() => console.log("payment")}
            />
          </Grid>
          <Grid item className={classes.button}>
            <Typography variant="h6">Total Price: 290$</Typography>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

const CardForm = injectStripe(_CardForm);

const Payment = props => {
  const classes = useStyles();
  return (
    <Grid container justify="center" alignContent="center">
      <Grid item xs={12} sm={8}>
        <Paper className={classes.paper}>
          <StripeProvider apiKey={"pk_test_12345"}>
            <Elements>
              <CardForm handleResult={props.handleResult} />
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
    margin: theme.spacing(1),
    boxShadow: shadows.purpleShadow
  },

  button: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
  spacing: {
    margin: theme.spacing(4, 0)
  },
  textField: {}
}));

export default Payment;
