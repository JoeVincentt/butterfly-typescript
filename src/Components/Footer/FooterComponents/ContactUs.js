import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { Helmet } from "react-helmet";
import axios from "axios";
import {
  Grid,
  Typography,
  Box,
  Paper,
  TextField,
  CircularProgress
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import GradientButton from "../../Buttons/GradientButton";
import { emailRegex } from "../../utils/regex";

const ContactUs = () => {
  const classes = useStyles();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = () => {
    return emailRegex.test(email.toLowerCase());
  };

  const sendMessage = async () => {
    if (
      fullName.trim().length <= 0 ||
      email.trim().length <= 0 ||
      subject.trim().length <= 0 ||
      message.trim().length <= 0 ||
      validateEmail() === false
    ) {
      enqueueSnackbar("Oops! Please make sure to fill-up the form.", {
        variant: "error"
      });
      return;
    } else {
      setLoading(true);
      let url;
      if (process.env.NODE_ENV === "production") {
        url =
          "https://us-central1-butterfly-remote-jobs-dev.cloudfunctions.net/contactUsEmailSendToCustomerSupport";
      } else {
        url =
          "https://us-central1-butterfly-remote-jobs-dev.cloudfunctions.net/contactUsEmailSendToCustomerSupport";
      }
      const data = {
        fullName: fullName,
        email: email,
        subject: subject,
        message: message
      };
      const response = await axios({
        method: "POST",
        url: url,
        data: data
      });
      //     console.log(response);
      if (response.data.success === true) {
        enqueueSnackbar(
          "Thank You! Message Sent. We will respond in the next 48 hours.",
          {
            variant: "success"
          }
        );
        clearAllFields();
        setLoading(false);
      }
      if (response.data.success === false) {
        enqueueSnackbar("Oops! Something went wrong! Please try again.", {
          variant: "error"
        });
        setLoading(false);
      }
    }
  };

  const clearAllFields = () => {
    setFullName("");
    setEmail("");
    setMessage("");
    setSubject("");
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Contact Us</title>
      </Helmet>
      <Grid container justify="center" alignContent="center" direction="column">
        <Grid item xs={12} sm={8}>
          <Paper className={classes.paper}>
            <Box textAlign="center" className={classes.spacing}>
              <Typography variant="h3">Contact Us</Typography>
            </Box>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="fullName"
                      label="Full Name"
                      variant="outlined"
                      fullWidth
                      disabled={loading}
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="email"
                      label="Email"
                      variant="outlined"
                      fullWidth
                      disabled={loading}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="subject"
                  label="Subject"
                  variant="outlined"
                  fullWidth
                  disabled={loading}
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="message"
                  label="Message"
                  variant="outlined"
                  multiline
                  fullWidth
                  rows="4"
                  disabled={loading}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Box textAlign="center">
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <GradientButton
                      text="send message"
                      labelName="sendMessage"
                      size="large"
                      onClick={() => sendMessage()}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(4)
  },
  spacing: {
    paddingBottom: theme.spacing(3)
  }
}));

export default ContactUs;
