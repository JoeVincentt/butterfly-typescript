import React from "react";
import { Helmet } from "react-helmet";
import { Grid, Typography, Box, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const About = () => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Helmet>
        <title>About</title>
      </Helmet>
      <Grid container justify="center" alignContent="center" direction="column">
        <Grid item xs={12} sm={8}>
          <Paper className={classes.paper}>
            <Box textAlign="center" className={classes.spacing}>
              <Typography variant="h3">A Great Match</Typography>
            </Box>
            {/* <Box textAlign="left">
            <iframe
              width="100%"
              height="300px"
              src="https://www.youtube.com/embed/tgbNymZ7vqY"
            ></iframe>
          </Box> */}
            <Box textAlign="left" className={classes.spacing}>
              <Typography variant="body1">
                <b>Butterfly Remote Jobs</b> is the easiest and fastest online
                job board place to connect you to the growing trend of remote
                positions. <b>Butterfly Remote Jobs</b> is the platform for you,
                and whether you’re listing an open remote position or the
                searching for one, we’ve got the best solution for you. Our
                specialty is exclusively remote jobs and we really want to
                emphasize our focus on the simplicity and swiftness of signing
                up to, and benefiting from our platform. If you’re looking for
                remote work, we have an ever-growing number of jobs you can
                apply to, so you’ll be able have a schedule that is flexible and
                suits you. You can work in the comfort of your favorite
                surroundings, home, your bed, or that hip coffee shop across the
                road. Above all you’ll feel the freedom of working from
                anywhere. If you’re hiring, then our advanced logarithm program
                will direct you effortlessly to the most suitable employee.
              </Typography>
            </Box>
            <Box textAlign="left" className={classes.spacing}>
              <Typography variant="h6">We offer a:</Typography>
              <ul>
                <li>job board with dashboards for job seeker and employer</li>
                <li>high quality remote jobs, high quality employees</li>
                <li>
                  daily job alert or employee alert which is sent to your inbox
                </li>
                <li>
                  simple method to keep track, be up-to-date and manage job
                  postings or applications{" "}
                </li>
              </ul>
            </Box>
            <Box textAlign="left" className={classes.spacing}>
              <Typography variant="body1">
                Ease and speed is the key here. Spend only a few minutes
                choosing the categories indicating your priorities and you’ll
                only be a few clicks away to finding a perfect position.
              </Typography>
            </Box>
            <Box textAlign="left" className={classes.spacing}>
              <Typography variant="body1">
                It is our goal to provide the best for you in your search, and
                to make the process quicker and faster than what is available
                today. So, let <b>Butterfly Remote Jobs</b> spread our wings and
                get you off the ground.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2)
  },
  spacing: {
    padding: theme.spacing(2, 0)
  }
}));

export default About;
