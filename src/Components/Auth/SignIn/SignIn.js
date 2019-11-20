import React from "react";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";

import "./SignIn.css";

import signInImageBackground from "../../../images/signUpInBackground.png";

const SignIn = () => {
  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.image}>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={10}
        container
        direction="column"
        justify="center"
        alignItems="flex-end"
      >
        <Grid item xs={12}>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h6">
              Sign In
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant="filled"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />

              <TextField
                variant="filled"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />

              <Fab
                onClick={() => console.log("submit")}
                color="primary"
                variant="extended"
                size="large"
                aria-label="submit"
                className={classes.submit}
              >
                Submit
              </Fab>

              <Grid container>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Already have an account? Sign In"}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Grid>{" "}
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  image: {
    height: "100vh",
    backgroundImage: `url(${signInImageBackground})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  paper: {
    margin: theme.spacing(6, 2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#8a24ae"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    background: "linear-gradient(to bottom, #ff00cc, #333399)",
    margin: theme.spacing(3, 0, 3)
  }
}));

export default SignIn;
