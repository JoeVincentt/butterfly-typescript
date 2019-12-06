import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Typography, Divider } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";

import GradientButton from "../../Buttons/GradientButton";

import "./AdvertisementPlan.css";
import colors from "../../../constants/colors";

import { plans } from "../../../MockUpData/plans";
import {
  PaymentDispatchContext,
  PaymentStateContext
} from "../../../StateManagement/PaymentState";

const AdvertisementPlan = () => {
  const classes = useStyles();

  const { basePrice } = useContext(PaymentStateContext);
  const dispatch = useContext(PaymentDispatchContext);

  const [active, setActive] = React.useState(null);

  const selectPlan = (id, standardPrice) => {
    setActive(id);
    const newPrice = Number(basePrice + standardPrice);
    dispatch({
      type: "field",
      fieldName: "price",
      payload: newPrice
    });
  };

  const renderPlans = plans => {
    return plans.map((plan, index) => (
      <Grid key={index} item xs={12} sm={8} md={4}>
        <Paper
          id={active === plan.id ? "advertisement_plan" : null}
          className={active !== plan.id ? classes.paper : classes.paperActive}
          elevation={0}
        >
          <Grid container spacing={2} direction="column">
            <Grid item className={classes.textPlanNameContainer}>
              <Typography variant="h4" className={classes.textPlanName}>
                {plan.planName.toUpperCase()}
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
                <Divider />
                <Grid item>
                  <Typography color="textSecondary" variant="caption">
                    / MONTH
                  </Typography>
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
                onClick={() => selectPlan(plan.id, plan.price)}
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
    flexGrow: 1,
    margin: theme.spacing(1),
    padding: theme.spacing(1)
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
    boxShadow: "0 0 20px 0px rgba(107, 19, 107, 0.4)",
    transform: "scale(1.02)"
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
