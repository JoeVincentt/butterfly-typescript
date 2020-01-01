import React from "react";
import ExpandMoreOutlinedIcon from "@material-ui/icons/ExpandMoreOutlined";
import { Button, Box, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const SeeMoreButton = ({ handleLoad, loading, noMoreJobs, text }) => {
  const classes = useStyles();

  if (loading) {
    return (
      <Box textAlign="center">
        <CircularProgress className={classes.button} />
      </Box>
    );
  } else {
    return (
      <Box textAlign="center">
        <Button
          disabled={noMoreJobs}
          color="primary"
          className={classes.button}
          size="large"
          endIcon={<ExpandMoreOutlinedIcon />}
          onClick={() => handleLoad()}
        >
          {noMoreJobs ? text : "see more"}
        </Button>
      </Box>
    );
  }
};

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(2)
  }
}));

export default SeeMoreButton;
