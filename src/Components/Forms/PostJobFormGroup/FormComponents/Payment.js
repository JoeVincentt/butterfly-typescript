import React, { Component } from "react";
import {
  CardElement,
  injectStripe,
  StripeProvider,
  Elements
} from "react-stripe-elements";
import { Grid, Paper, Button, Typography, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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
        <Grid container alignContent="center" justify="center">
          <TextField
            id="fullName"
            className={classes.textField}
            label="Full Name"
            margin="normal"
            variant="outlined"
            fullWidth
            required
            color="primary"
          />
          <TextField
            id="Address"
            className={classes.textField}
            label="Address"
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
          />
        </Grid>
        <Typography variant="subtitle1" className={classes.spacing}>
          Card Details
        </Typography>

        <CardElement onChange={handleChange} {...createOptions()} />

        <div className="error" role="alert">
          {errorMessage}
        </div>

        <Grid container justify="center">
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Pay
          </Button>
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
      <Grid item xs={12} sm={6}>
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
    margin: theme.spacing(3, 1)
  },

  button: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(2, 8)
  },
  spacing: {
    margin: theme.spacing(4, 0)
  },
  textField: {}
}));

export default Payment;
