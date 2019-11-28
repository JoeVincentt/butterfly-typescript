import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import { Typography, Box } from "@material-ui/core";

const Footer = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Grid container direction="row" justify="center" alignContent="center">
        <Grid item>
          <div className={classes.paper}>Contact Us</div>
        </Grid>
        <Grid item>
          <div className={classes.paper}>|</div>
        </Grid>

        <Grid item>
          <div className={classes.paper}>Terms and Conditions</div>
        </Grid>

        <Grid item>
          <div className={classes.paper}>|</div>
        </Grid>

        <Grid item>
          <div className={classes.paper}>Privacy Policy</div>
        </Grid>
      </Grid>

      <Box mt={1} mb={2}>
        <Copyright />
      </Box>
    </footer>
  );
};

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="#">
        Butterfly Jobs
      </Link>{" "}
      {new Date().getFullYear()}
      {"."} All rights Reserved
    </Typography>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(1, 1),
    textAlign: "center",
    color: theme.palette.text.secondary
  },

  footer: {
    fontFamily: "Helvetica Neue, Helvetica",
    padding: theme.spacing(1),
    marginTop: "auto"
    // boxShadow: "0 0 10px 0px rgba(107, 19, 107, 0.2)"
  }
}));

export default Footer;
