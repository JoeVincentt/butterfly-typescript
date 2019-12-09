import React from "react";

import "./ButterflyLoader.css";
import logo from "../../images/logo.webp";
import { Grid } from "@material-ui/core";

const ButterflyLoader = () => (
  <Grid container direction="column" justify="center" alignContent="center">
    <img
      className="animated-logo-butterfly pulse"
      src={logo}
      alt="animated-logo"
      style={{ height: 40, width: 40 }}
    />
  </Grid>
);

export default ButterflyLoader;
