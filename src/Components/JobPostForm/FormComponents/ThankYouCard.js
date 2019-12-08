import React from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Paper, Button } from "@material-ui/core";
import colors from "../../../constants/colors";
import shadows from "../../../constants/shadows";
import GradientButton from "../../Buttons/GradientButton";

const ThankYouCard = props => {
  const classes = useStyles();

  return (
    <Grid container justify="center" alignContent="center">
      <Grid item xs={12} sm={6}>
        <Paper className={classes.paper}>
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
              <Typography variant="h6" color="textSecondary">
                Please check your email for receipt.
              </Typography>
            </Grid>
            <Grid item className={classes.button}>
              {" "}
              <GradientButton
                text="Go to dashboard"
                labelName="goToDash"
                size="large"
                onClick={() => props.history.push("/dashboard")}
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
    textAlign: "center",
    boxShadow: shadows.purpleShadow
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
