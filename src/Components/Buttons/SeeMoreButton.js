import React from "react";
import ExpandMoreOutlinedIcon from "@material-ui/icons/ExpandMoreOutlined";
import { Button, Box, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const SeeMoreButton = ({ handleLoad, loading, noMoreJobs }) => {
  const classes = useStyles();

  if (loading) {
    return (
      <Box textAlign="center">
        <CircularProgress />
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
          {noMoreJobs ? "no more jobs in this category" : "see more"}
        </Button>
      </Box>
    );
  }
};

const useStyles = makeStyles(theme => ({}));

export default SeeMoreButton;
