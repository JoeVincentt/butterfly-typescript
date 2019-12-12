import React from "react";
import { firestore } from "firebase/app";
import "firebase/firestore";
import {
  Grid,
  Paper,
  Button,
  Typography,
  TextField,
  Box,
  IconButton,
  Link,
  CircularProgress,
  Grow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@material-ui/icons/Instagram";

import { Helmet } from "react-helmet";

import GradientButton from "../Buttons/GradientButton";
import Policies from "./Policies";
import logo from "../../images/logoFull.webp";

import { emailRegex } from "../utils/regex";

import background from "../../images/pre-subscription.webp";
import colors from "../../constants/colors";
// import shadows from "../../constants/shadows";

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="#">
        Butterfly Remote Jobs. Digital Solution LLC
      </Link>{" "}
      {new Date().getFullYear()}
      {"."} All rights Reserved
    </Typography>
  );
};

const Subscribe = () => {
  const db = firestore();
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);
  const [amountOfSubscriptions, setAmountOfSubscriptions] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [invalidEmail, setInvalidEmail] = React.useState(false);
  const [subscribedSuccessfully, setSubscribedSuccessfully] = React.useState(
    false
  );
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openPolicy, setOpenPolicy] = React.useState(false);

  const handleClickOpenPolicy = () => {
    setOpenPolicy(true);
  };

  const handleClosePolicy = () => {
    setOpenPolicy(false);
  };

  React.useEffect(() => {
    checkIfAgreedToPolicy();
    getAmountOfSubscriptions();
  }, []);

  const checkIfAgreedToPolicy = () => {
    const agreed = localStorage.getItem("policies");
    if (agreed) {
      setOpenDialog(false);
    } else {
      setOpenDialog(true);
    }
  };

  const getAmountOfSubscriptions = () => {
    db.collection("pre-subscription-email-amount")
      .doc("TerMh096qOi5fAKOOh6A")
      .get()
      .then(doc => {
        if (doc.exists) {
          let data = doc.data();
          setAmountOfSubscriptions(data.numberOfSubscriptions);
          setLoading(false);
        } else {
          // doc.data() will be undefined in this case
          // console.log("No such document!");
        }
      })
      .catch(function(error) {
        // console.log("Error getting document:", error);
      });
  };

  const subscribe = email => {
    let validate = emailRegex.test(email.toLowerCase());
    if (validate === false) {
      setSubscribedSuccessfully(false);
      setInvalidEmail(true);
      return;
    } else {
      const increment = firestore.FieldValue.increment(1);

      db.collection("pre-subscription-emails")
        .doc(email)
        .get()
        .then(doc => {
          if (doc.exists) {
            return;
          } else {
            db.collection("pre-subscription-email-amount")
              .doc("TerMh096qOi5fAKOOh6A")
              .update({
                numberOfSubscriptions: increment
              })
              .then(() => setAmountOfSubscriptions(amountOfSubscriptions + 1));
            db.collection("pre-subscription-emails")
              .doc(email)
              .set({
                email: email
              });
          }
        })
        .catch(function(error) {
          // console.log("Error getting document:", error);
        });

      setSubscribedSuccessfully(true);
      return;
    }
  };

  const handleChange = e => {
    if (invalidEmail || subscribedSuccessfully) {
      setSubscribedSuccessfully(false);
      setInvalidEmail(false);
    }
    setEmail(e.target.value);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    localStorage.setItem("policies", true);
  };

  const renderPolicy = () => (
    <Policies open={openPolicy} handleClose={handleClosePolicy} />
  );
  const renderDialog = () => (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Agreement Terms & Privacy / Cookie Policy"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          By clicking "Agree & Accept" You are agreed to our{" "}
          <span className={classes.hyperlink} onClick={handleClickOpenPolicy}>
            Terms of Use and Privacy Policy
          </span>
          . We use cookies and other similar technologies to improve your
          browsing experience and the functionality of our site. By clicking
          "Agree & Accept" you consent to the storing on your device of all the
          technologies described in our{" "}
          <span className={classes.hyperlink} onClick={handleClickOpenPolicy}>
            Cookie Policy
          </span>
          ".
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseDialog}
          className={classes.dialogButton}
          autoFocus
        >
          Agree & Accept
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <React.Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Subscribe to Butterfly Remote Jobs</title>
        <meta
          name="description"
          content="Best place to find remote work. Best place to hire."
        />
        <link rel="canonical" href="https://butterflyremote.com" />
      </Helmet>
      <Grid
        container
        justify="center"
        alignContent="center"
        className={classes.root}
      >
        {renderPolicy()}
        {renderDialog()}
        <Grid item xs={12} sm={12} md={8} lg={6}>
          <Paper className={classes.paper}>
            <Grid container direction="column">
              <Box textAlign="center">
                <img
                  className={classes.logoImg}
                  alt="Butterfly remote"
                  src={logo}
                ></img>

                <Typography variant="h6" className={classes.description}>
                  Are you looking to hire the best talent? Or you are the talent
                  who is looking for remote opportunities?
                  {/* Make a step in the
                future with the Butterfly Remote platform, which connects best
                companies to work for with the most exceptional talents who
                deserve to get a job of their dream.  */}{" "}
                  Please subscribe to be notified once we launch. Don't miss the
                  chance to get the most out of our platform!
                </Typography>
              </Box>

              <Box textAlign="center" className={classes.subscribeBoxField}>
                <Box style={{ minHeight: 30 }}>
                  <Grow in={subscribedSuccessfully}>
                    <Typography
                      variant="h5"
                      className={classes.captionCommentThankYou}
                    >
                      {subscribedSuccessfully &&
                        "Thank you! We will notify you once our platform is ready to go."}
                    </Typography>
                  </Grow>
                  <Grow in={invalidEmail}>
                    <Typography
                      variant="body1"
                      className={classes.captionCommentInvalidEmail}
                    >
                      {invalidEmail && "Please enter a valid email address."}
                    </Typography>
                  </Grow>
                </Box>

                <TextField
                  variant="standard"
                  margin="normal"
                  fullWidth
                  name="email"
                  label="Enter you email address"
                  type="email"
                  id="email"
                  autoComplete="email"
                  onChange={e => handleChange(e)}
                />
              </Box>

              <Box textAlign="center">
                <GradientButton
                  text="Subscribe"
                  labelName="subscribe"
                  size="large"
                  onClick={() => subscribe(email)}
                />
              </Box>
              <Grid item xs={12}>
                <Grid container justify="center">
                  <Box textAlign="center" className={classes.subscribeBoxField}>
                    <Typography variant="h5" color="textSecondary">
                      Total Subscribers
                    </Typography>
                    <Box
                      border={1}
                      borderRadius={16}
                      className={classes.subscribersAmountBoxField}
                    >
                      <Typography
                        variant="h2"
                        className={classes.subscribersAmountText}
                      >
                        {!loading ? (
                          amountOfSubscriptions.toString()
                        ) : (
                          <CircularProgress color="secondary" />
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                justify="center"
                alignContent="center"
              >
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
              <Box textAlign="center">{Copyright()}</Box>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh",
    backgroundImage: `url(${background})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    "@media (max-width: 420px)": {
      height: "auto"
    },
    "@media (max-height: 820px)": {
      height: "auto"
    }
  },
  paper: {
    padding: theme.spacing(4),
    "@media (max-width: 960px)": {
      margin: theme.spacing(1),
      padding: theme.spacing(2)
    },
    boxShadow: "0 0 400px 0px rgba(70, 9, 125, 0.53)"
  },
  captionCommentThankYou: {
    color: colors.purple
  },
  captionCommentInvalidEmail: {
    color: "red"
  },
  subscribeBoxField: {
    padding: theme.spacing(5),
    "@media (max-width: 650px)": {
      padding: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  subscribersAmountBoxField: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    borderColor: colors.purple
    // boxShadow: shadows.purpleShadow
  },
  subscribersAmountText: {
    color: colors.purple
  },
  margin: {
    margin: theme.spacing(2)
  },
  logoImg: {
    margin: theme.spacing(3),
    width: "auto",
    height: 250,
    "@media (max-width: 650px)": {
      width: "auto",
      height: 150
    }
  },
  icon: {
    fontSize: "2rem",
    "&:hover": {
      color: colors.purple
    }
  },
  dialogButton: {
    color: colors.purple
  },
  hyperlink: {
    textDecoration: "underline",
    cursor: "pointer"
  }
}));

export default Subscribe;
