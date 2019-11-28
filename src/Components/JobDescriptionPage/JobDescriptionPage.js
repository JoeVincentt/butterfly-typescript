import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import AccessTimeIcon from "@material-ui/icons/AccessTime";

import colors from "../../constants/colors";

import CompanyInfoCard from "./CompanyInfoCard";

import { jobs } from "../../MockUpData/jobs";

const JobDescriptionPage = props => {
  const classes = useStyles();
  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(props.match.params.id);

    //need to fetch job description from the database
    const getAJobFromTheList = async () => {
      await jobs.forEach(job => {
        if (job.id === props.match.params.id) {
          // console.log(job);
          setJob(job);
        }
      });
    };
    getAJobFromTheList();
    setLoading(false);
    // code to run on component mount
  }, []);

  const renderDate = date => (
    <Grid container direction="row" justify="flex-end" alignItems="center">
      <Grid item>
        <AccessTimeIcon className={classes.icon} />
      </Grid>
      <Grid item>
        <Typography variant="subtitle2" className={classes.spacing}>
          {date}
        </Typography>
      </Grid>
    </Grid>
  );

  const renderJobTitle = title => (
    <Grid container spacing={2} item xs={12}>
      <Typography variant="h5" className={classes.spacing}>
        {title}
      </Typography>
    </Grid>
  );

  const renderJobHighlights = highlights => (
    <Grid container spacing={2} item xs={12} direction="row">
      {highlights.map((highlight, index) => (
        <Fab
          key={index}
          disableRipple
          variant="extended"
          size="medium"
          color="primary"
          aria-label="highlight"
          className={classes.highlightPaper}
        >
          {highlight.toUpperCase()}
        </Fab>
      ))}
    </Grid>
  );

  const renderJobAbout = about => (
    <Grid container spacing={2} item xs={12}>
      <Typography variant="subtitle1" className={classes.spacing}>
        {about}
      </Typography>{" "}
    </Grid>
  );

  const renderListProperty = (args, name) => {
    if (args.length > 0) {
      return (
        <Grid container spacing={2} item xs={12} direction="column">
          <Typography className={classes.listTitle}>{name}</Typography>
          <ul>
            {args.map((item, index) => (
              <li key={index} className={classes.listItem}>
                {item}
              </li>
            ))}
          </ul>
        </Grid>
      );
    } else {
      return;
    }
  };

  return (
    <div className={classes.root}>
      {loading ? (
        <div>loading</div>
      ) : (
        <Grid container justify="center" alignContent="center">
          {/* Company Card */}
          <Grid item xs={12} sm={4} md={2}>
            <CompanyInfoCard
              location={job.location}
              company={job.company}
              companyId={job.companyId}
              logoImage={job.logoImage}
              altLogoText={job.altLogoText}
            />
          </Grid>

          {/* Basic Info */}
          <Grid item xs={12} sm={8} md={10} lg={8}>
            <Paper className={classes.paper}>
              {renderDate(job.date)}
              {renderJobTitle(job.title)}
              {renderJobAbout(job.description.about)}
              {renderJobHighlights(job.description.highlights)}
              {renderListProperty(
                job.description.responsibilities,
                "Responsibilities"
              )}
              {renderListProperty(
                job.description.educationAndExperience,
                "Education and Experience"
              )}
              {renderListProperty(job.description.skills, "Skills")}
              {renderListProperty(job.description.benefits, "Benefits")}
            </Paper>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(4),
    margin: theme.spacing(1),
    color: theme.palette.text.secondary,
    boxShadow: "0 0 10px 0px rgba(107, 19, 107, 0.2)"
  },
  highlightPaper: {
    padding: theme.spacing(10),
    margin: theme.spacing(2),
    marginLeft: theme.spacing(0),
    textAlign: "center",
    color: colors.purple,
    boxShadow: "none",
    backgroundColor: "rgba(107, 19, 107, 0.1)",
    "&:hover": {
      cursor: "auto",
      backgroundColor: "rgba(107, 19, 107, 0.1)"
    },
    "&:active": {
      boxShadow: "0 0 10px 0px rgba(107, 19, 107, 0.1)"
    }
  },
  spacing: {
    margin: theme.spacing(1)
  },
  listTitle: {
    margin: theme.spacing(1),
    fontSize: "1rem",
    fontWeight: 500,
    marginBottom: -10
  },
  icon: {
    marginTop: 5,
    fontSize: "1.1rem",
    color: colors.darkGrey
  }
}));

export default withRouter(JobDescriptionPage);
