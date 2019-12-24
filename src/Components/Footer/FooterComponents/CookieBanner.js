import React, { useEffect, useState } from "react";
import { Paper, Typography, Button, Box, Slide } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const CookieBanner = () => {
  const classes = useStyles();

  const [cookieAgreed, setCookieAgreed] = useState(true);

  useEffect(() => {
    checkIfAgreed();
  }, [cookieAgreed]);

  const checkIfAgreed = () => {
    const cookie = localStorage.getItem("cookieAgreed");
    if (cookie !== null) {
      setCookieAgreed(false);
    }
  };

  const agreeToCookiePolicy = () => {
    localStorage.setItem("cookieAgreed", true);
    setCookieAgreed(false);
  };

  return (
    <React.Fragment>
      <Slide direction="up" in={cookieAgreed} mountOnEnter unmountOnExit>
        <Paper className={classes.paper} square>
          <Box textAlign="center" m={1}>
            <Typography variant="caption">
              This website uses cookies. By using this website you concent to
              our use of these cookies. For more information visit our{" "}
              <span>
                <a
                  style={{ color: "#8e24aa" }}
                  href="https://app.termly.io/document/privacy-policy/77c0a45f-6dab-4065-be59-126dc1af09d1"
                >
                  Privacy Policy
                </a>
              </span>{" "}
              and{" "}
              <span>
                <a
                  style={{ color: "#8e24aa" }}
                  href="https://app.termly.io/document/terms-of-use-for-saas/a5c3ec46-9aa9-4dd6-a400-ad98d3f06924"
                >
                  Terms and Conditions
                </a>
              </span>
              .
            </Typography>
          </Box>{" "}
          <Box textAlign="center" m={1}>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => agreeToCookiePolicy()}
            >
              Accept & Close
            </Button>
          </Box>
        </Paper>
      </Slide>
    </React.Fragment>
  );
};

const useStyles = makeStyles(theme => ({
  paper: {
    position: "fixed",
    bottom: 0,
    right: 0,
    height: "auto",
    width: "100%",
    zIndex: 100,
    backgroundColor: "#faeef4"
  }
}));

export default CookieBanner;
