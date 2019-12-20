import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Typography, Box, IconButton } from "@material-ui/core";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@material-ui/icons/Instagram";

const LinkNoStyle = props => (
  <Link style={{ textDecoration: "none" }} {...props} to={props.to}>
    {props.children}
  </Link>
);

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
          <LinkNoStyle to="/about">
            <div className={classes.text}>About</div>
          </LinkNoStyle>
        </Grid>
        <Grid item>
          <div className={classes.text}>|</div>
        </Grid>

        <Grid item>
          <LinkNoStyle to="/contact-us">
            <div className={classes.text}>Contact Us</div>
          </LinkNoStyle>
        </Grid>
        <Grid item>
          <div className={classes.text}>|</div>
        </Grid>

        <Grid item>
          {/* <LinkNoStyle to="/terms-and-conditions"> */}
          <a
            href="https://app.termly.io/document/terms-of-use-for-saas/a5c3ec46-9aa9-4dd6-a400-ad98d3f06924"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <div className={classes.text}>Terms and Conditions</div>
          </a>
          {/* </LinkNoStyle> */}
        </Grid>
        <Grid item>
          <div className={classes.text}>|</div>
        </Grid>

        <Grid item>
          {/* <LinkNoStyle to="/privacy-policy"> */}
          <a
            href="https://app.termly.io/document/privacy-policy/77c0a45f-6dab-4065-be59-126dc1af09d1"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <div className={classes.text}>Privacy Policy</div>
          </a>
          {/* </LinkNoStyle> */}
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
      <span color="inherit">
        ButterflyRemote.com | Digital Solution LLC
      </span>{" "}
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
