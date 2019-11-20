import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Typography, Divider, Button } from "@material-ui/core";

import { plans } from "../../../../MockUpData/plans";

const AdvertisementPlan = () => {
  const classes = useStyles();

  const [active, setActive] = React.useState(null);

  const renderPlans = plans => {
    return plans.map((plan, index) => (
      <Grid key={index} item xs={12} sm={4} md={4}>
        <Paper
          className={active !== plan.id ? classes.paper : classes.paperActive}
          elevation={active === plan.id ? 10 : 0}
        >
          <Grid>
            <Typography variant="h4">{plan.planName}</Typography>
            <Typography variant="h6">What you get:</Typography>
            {plan.offers.map((offer, index) => (
              <Typography key={index} variant="body1">
                {offer}
              </Typography>
            ))}
            <Divider />
            <Typography variant="h4">${plan.price}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setActive(plan.id)}
            >
              Choose Plan
            </Button>
          </Grid>
        </Paper>
      </Grid>
    ));
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2} justify="center">
        {renderPlans(plans)}
      </Grid>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  paperActive: {
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.primary
  }
}));

export default AdvertisementPlan;
