import React from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Paper } from "@material-ui/core";

import colors from "../../../constants/colors";
import GradientButton from "../../Buttons/GradientButton";

const ThankYouCard = props => {
  const classes = useStyles();

  return (
    <Grid container justify="center" alignContent="center">
      <Grid item xs={12}>
        <Paper className={classes.paper} elevation={0}>
          <Grid
            container
            spacing={2}
            direction="column"
            justify="center"
            alignContent="center"
          >
            <Grid item>
              {" "}
              <Typography variant="h6" color="primary">
                Thank You!
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" color="textSecondary">
                Please check your email for a receipt.
              </Typography>
            </Grid>
            <Grid item className={classes.button}>
              {" "}
              <GradientButton
                text="Go to dashboard"
                labelName="goToDash"
                size="large"
                onClick={() => props.history.push("/dashboard-overview")}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    textAlign: "center"
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  spacing: {
    margin: theme.spacing(4, 0)
  },
  thankYouText: {
    color: colors.pinkLight
  }
}));

export default withRouter(ThankYouCard);
