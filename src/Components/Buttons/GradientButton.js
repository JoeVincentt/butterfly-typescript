import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";

import "./GradientButton.css";

const Button = ({ onClick, text, labelName, size }) => {
  const classes = useStyles();

  return (
    <Fab
      onClick={() => onClick()}
      color="primary"
      variant="extended"
      size={size}
      aria-label={labelName}
      className={classes.button}
      id="gradientButton"
    >
      {text.toUpperCase()}
    </Fab>
  );
};

const useStyles = makeStyles(theme => ({
  button: {
    background: `linear-gradient(to bottom, #8e24aa, #333399)`
  }
}));

export default Button;
