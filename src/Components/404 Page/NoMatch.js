import React from "react";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Container, Grid, Typography } from "@material-ui/core";
import GradientButton from "../Buttons/GradientButton";

const NoMatch = ({ history }) => {
  return (
    <React.Fragment>
      <Helmet>
        <title>404 Page Not Found</title>
      </Helmet>
      <Container>
        <Grid
          container
          direction="column"
          spacing={3}
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <Typography variant="h4">404 - PAGE NOT FOUND</Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1" color="textSecondary">
              The page you are looking for might have been removed had its name
              changed or is temporarily unavailable.
            </Typography>
          </Grid>
          <Grid item>
            <GradientButton
              size="large"
              labelName="go-home"
              text="go to homepage"
              onClick={() => history.push("/")}
            />
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default withRouter(NoMatch);
