import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import withWidth from "@material-ui/core/withWidth";
import { Typography, Divider } from "@material-ui/core";

import CompanyInfoCard from "./CompanyInfoCard";

import { jobs } from "../../MockUpData/jobs";

const JobDescriptionPage = props => {
  const classes = useStyles();

  const job = jobs[0]; //is going to come from props
  const {
    id,
    title,
    location,
    company,
    companyId,
    logoImage,
    altLogoText,
    date
  } = job;
  const {
    highlights,
    about,
    responsibilities,
    educationAndExperience,
    skills,
    benefits
  } = job.description;

  const renderDate = date => (
    <Grid container direction="row" justify="flex-end" alignItems="flex-start">
      <Typography variant="subtitle2" className={classes.spacing}>
        {date}
      </Typography>
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
        <Paper className={classes.highlightPaper} key={index}>
          {highlight.toUpperCase()}
        </Paper>
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
              <li key={index}>{item}</li>
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
      <Grid container spacing={3}>
        {/* Small Screen */}
        <Hidden smUp>
          {/* Company Card */}
          <Grid item xs={12}>
            <CompanyInfoCard
              location={location}
              company={company}
              companyId={companyId}
              logoImage={logoImage}
              altLogoText={altLogoText}
            />
          </Grid>

          {/* Basic Info */}
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              {renderDate(date)}
              {renderJobTitle(title)}
              {renderJobHighlights(highlights)}
              {renderJobAbout(about)}
              {renderListProperty(responsibilities, "Responsibilities")}
              {renderListProperty(
                educationAndExperience,
                "Education and Experience"
              )}
              {renderListProperty(skills, "Skills")}
              {renderListProperty(benefits, "Benefits")}
            </Paper>
          </Grid>
        </Hidden>

        {/* MD and UP */}
        <Hidden xsDown>
          {/* Basic Info */}
          <Grid item xs={9}>
            <Paper className={classes.paper}>
              {renderDate(date)}
              {renderJobTitle(title)}
              {renderJobHighlights(highlights)}
              {renderJobAbout(about)}
              {renderListProperty(responsibilities, "Responsibilities")}
              {renderListProperty(
                educationAndExperience,
                "Education and Experience"
              )}
              {renderListProperty(skills, "Skills")}
              {renderListProperty(benefits, "Benefits")}
            </Paper>
          </Grid>
          {/* Company Card */}
          <Grid item xs={3}>
            <CompanyInfoCard
              location={location}
              company={company}
              companyId={companyId}
              logoImage={logoImage}
              altLogoText={altLogoText}
            />
          </Grid>
        </Hidden>
      </Grid>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    color: theme.palette.text.secondary
  },
  highlightPaper: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  spacing: {
    margin: theme.spacing(1)
  },
  listTitle: {
    margin: theme.spacing(1),
    fontSize: "1rem",
    fontWeight: 500,
    marginBottom: -10
  }
}));

JobDescriptionPage.propTypes = {
  width: PropTypes.oneOf(["lg", "md", "sm", "xl", "xs"]).isRequired
};

export default withWidth()(JobDescriptionPage);
