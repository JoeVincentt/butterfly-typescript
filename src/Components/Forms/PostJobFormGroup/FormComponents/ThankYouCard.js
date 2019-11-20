import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Paper, Button } from "@material-ui/core";

const ThankYouCard = props => {
  const classes = useStyles();

  return (
    <Grid container justify="center" alignContent="center">
      <Grid item xs={12} sm={6}>
        <Paper className={classes.paper}>
          <Grid
            container
            direction="column"
            justify="center"
            alignContent="center"
          >
            <Typography variant="h6">Thank You!</Typography>
            <Typography variant="h5">Job Posting Completed</Typography>
            <Typography variant="subtitle1">
              Please check your email for confirmation.
            </Typography>
            <Typography variant="subtitle1">
              Order Number: 262tyahs12sa
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              className={classes.button}
            >
              Go to dashboard
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={props.handleReset}
            >
              Post Another job
            </Button>
          </Grid>
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
    marginTop: theme.spacing(2)
  },
  spacing: {
    margin: theme.spacing(4, 0)
  },
  textField: {}
}));

export default ThankYouCard;
