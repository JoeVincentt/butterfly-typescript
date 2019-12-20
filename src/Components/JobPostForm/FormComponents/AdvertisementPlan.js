import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Typography, Divider } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";

import GradientButton from "../../Buttons/GradientButton";
import colors from "../../../constants/colors";
import { plans } from "../../../AdditionalResources/plans";
import {
  PaymentDispatchContext,
  PaymentStateContext
} from "../../../StateManagement/PaymentState";
import {
  PostJobDispatchContext,
  PostJobStateContext
} from "../../../StateManagement/PostJobState";

const AdvertisementPlan = () => {
  const classes = useStyles();

  const { basePrice } = useContext(PaymentStateContext);
  const dispatch = useContext(PaymentDispatchContext);
  const dispatchPostJob = useContext(PostJobDispatchContext);
  const jobState = useContext(PostJobStateContext);

  const [active, setActive] = React.useState(null);

  useEffect(() => {
    setActive(jobState.advertisementPlan);
  }, []);

  const selectPlan = (name, standardPrice) => {
    setActive(name);
    const newPrice = Number(basePrice + standardPrice);
    dispatch({
      type: "field",
      fieldName: "price",
      payload: newPrice
    });
    dispatchPostJob({
      type: "field",
      fieldName: "advertisementPlan",
      payload: name
    });
  };

  const renderPlans = plans => {
    return plans.map((plan, index) => (
      <Grid key={index} item xs={12} sm={8} md={4}>
        <Paper
          className={active !== plan.name ? classes.paper : classes.paperActive}
          elevation={0}
        >
          <Grid container spacing={2} direction="column">
            <Grid item className={classes.textPlanNameContainer}>
              <Typography variant="h4" className={classes.textPlanName}>
                {plan.name.toUpperCase()}
              </Typography>
            </Grid>
            <Grid item>
              <Grid
                container
                direction="row"
                justify="center"
                alignContent="flex-start"
              >
                <Grid item>
                  <Typography color="textSecondary" variant="h6">
                    $
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h3">{plan.price}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Divider />
            <Grid item className={classes.offersContainer}>
              <Grid container spacing={1} direction="column" justify="center">
                {plan.offers.map((offer, index) => (
                  <Grid item key={index}>
                    <Grid
                      container
                      spacing={1}
                      direction="row"
                      justify="center"
                    >
                      <Grid item>
                        <CheckIcon className={classes.checkIcon} />
                      </Grid>
                      <Grid item>
                        <Typography color="textSecondary" variant="body1">
                          {offer}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item>
              <GradientButton
                onClick={() => selectPlan(plan.name, plan.price)}
                labelName="advertisementPlan"
                text="Choose Plan"
                size="large"
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    ));
  };

  return (
    <div className={classes.root}>
      <Grid container justify="center">
        {renderPlans(plans)}
      </Grid>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: "500px"
  },
  paper: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    textAlign: "center",
    border: "1px solid rgba(107, 19, 107, 0.1)"
  },
  paperActive: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    textAlign: "center",
    backgroundColor: "#faeef4"
  },
  textPlanName: {
    color: colors.pinkLight
  },
  textPlanNameContainer: {
    textAlign: "center"
  },
  checkIcon: {
    color: colors.pinkLight,
    fontSize: "1rem"
  },
  offersContainer: {
    marginTop: theme.spacing(2)
  }
}));

export default AdvertisementPlan;
