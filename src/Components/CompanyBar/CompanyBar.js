import React from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

import backgroundImage from "../../images/companybarWhite.jpg";
import logo from "../../images/logoFull.png";
import GradientButton from "../Buttons/GradientButton";

const CompanyBar = props => {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      alignContent="center"
      className={classes.root}
    >
      <Grid className={classes.logoBox}>
        <img src={logo} alt="logo" className={classes.logo} />
      </Grid>
      <GradientButton
        onClick={() => props.history.push("/post-a-job")}
        size="medium"
        labelName="postAJob"
        text="Post A Job"
      />
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    height: "400px",
    marginBottom: theme.spacing(4),
    backgroundImage: `url(${backgroundImage})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    "@media (max-width: 750px)": {
      height: "auto",
      backgroundPosition: "right"
    },
    "@media (min-width: 1800px)": {
      height: "500px",
      backgroundPosition: "right"
    }
  },
  logoBox: {
    margin: theme.spacing(3)
  },
  logo: {
    height: 300,
    width: "auto",
    "@media (max-width: 750px)": {
      height: 200
    }
  }
}));

export default withRouter(CompanyBar);
