import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Check from "@material-ui/icons/Check";
import StepConnector from "@material-ui/core/StepConnector";
import clsx from "clsx";

const CustomStepper = ({ activeStep, steps }) => {
  const classes = useStyles();

  return (
    <Stepper
      className={classes.stepper}
      alternativeLabel
      activeStep={activeStep}
      connector={<QontoConnector />}
    >
      {steps.map(label => (
        <Step key={label}>
          <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)"
  },
  active: {
    "& $line": {
      borderColor: "#8a24ae"
    }
  },
  completed: {
    "& $line": {
      borderColor: "#8a24ae"
    }
  },
  line: {
    borderColor: "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1
  }
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
  root: {
    color: "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center"
  },
  active: {
    color: "#8a24ae"
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor"
  },
  completed: {
    color: "#8a24ae",
    zIndex: 1,
    fontSize: 18
  }
});

const QontoStepIcon = props => {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active
      })}
    >
      {completed ? (
        <Check className={classes.completed} />
      ) : (
        <div className={classes.circle} />
      )}
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  stepper: {
    alignSelf: "stretch",
    backgroundColor: "inherit",
    marginTop: "5%"
  }
}));

export default CustomStepper;
