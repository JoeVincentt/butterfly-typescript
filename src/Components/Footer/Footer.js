import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import { Typography, Box, IconButton } from "@material-ui/core";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@material-ui/icons/Instagram";

const Footer = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Grid container direction="row" justify="center" alignContent="center">
        <a
          href="https://www.facebook.com/butterflyremote"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconButton aria-label="facebook" className={classes.margin}>
            <FacebookIcon className={classes.icon} />
          </IconButton>
        </a>

        <a
          href="https://www.linkedin.com/company/butterflyremote"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconButton aria-label="linkedin" className={classes.margin}>
            <LinkedInIcon className={classes.icon} />
          </IconButton>
        </a>

        <a
          href="https://www.instagram.com/butterflyremote"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconButton aria-label="instagram" className={classes.margin}>
            <InstagramIcon className={classes.icon} />
          </IconButton>
        </a>
      </Grid>
      <Grid container direction="row" justify="center" alignContent="center">
        <Grid item>
          <div className={classes.text}>Contact Us</div>
        </Grid>
        <Grid item>
          <div className={classes.text}>|</div>
        </Grid>

        <Grid item>
          <div className={classes.text}>Terms and Conditions</div>
        </Grid>

        <Grid item>
          <div className={classes.text}>|</div>
        </Grid>

        <Grid item>
          <div className={classes.text}>Privacy Policy</div>
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
        ButterflyRemote.com
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
  text: {
    padding: theme.spacing(1, 1),
    textAlign: "center",
    color: theme.palette.text.secondary
  },

  footer: {
    fontFamily: "Helvetica Neue, Helvetica",
    padding: theme.spacing(1),
    marginTop: theme.spacing(10),
    borderTop: "1px solid #80808045"
    // boxShadow: "0 0 10px 0px rgba(107, 19, 107, 0.2)"
  }
}));

export default Footer;
