import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import backgroundImage from "../../images/companybar.webp";
import logo from "../../images/logoFull.webp";
import { Grid } from "@material-ui/core";

const CompanyBar = () => {
  const classes = useStyles();

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
      alignContent="center"
      className={classes.root}
    >
      <Grid className={classes.logoBox}>
        <img src={logo} alt="logo" className={classes.logo} />
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    height: "400px",
    backgroundImage: `url(${backgroundImage})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    "@media (max-width: 750px)": {
      height: "auto",
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

export default CompanyBar;
