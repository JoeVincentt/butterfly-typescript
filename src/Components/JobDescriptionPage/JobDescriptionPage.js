import React, { useEffect, useState, useContext } from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Typography, LinearProgress } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import { convertTimestamp } from "../utils/convertTimestamp";

import colors from "../../constants/colors";

import ApplicationDialog from "../Application/ApplicationDialog";
import GradientButton from "../Buttons/GradientButton";
import CompanyInfoCard from "./CompanyInfoCard";
import { UserStateContext } from "../../StateManagement/UserState";

const JobDescriptionPage = ({ job }) => {
  const classes = useStyles();

  const { isLoggedIn } = useContext(UserStateContext);

  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  const renderDate = date => (
    <Grid container direction="row" justify="flex-end" alignItems="center">
      <Grid item>
        <AccessTimeIcon className={classes.icon} />
      </Grid>
      <Grid item>
        <Typography variant="subtitle2" className={classes.spacing}>
          {convertTimestamp(date)}
        </Typography>
      </Grid>
    </Grid>
  );

  const renderJobTitle = title => {
    if (title.trim().length !== 0) {
      return (
        <Grid container spacing={2} item xs={12}>
          <Typography variant="h5" className={classes.spacing}>
            {title}
          </Typography>
        </Grid>
      );
    }
  };

  const renderJobAbout = about => {
    if (about.trim().length !== 0) {
      return (
        <Grid container spacing={2} item xs={12}>
          <Typography variant="subtitle1" className={classes.spacing}>
            {about}
          </Typography>{" "}
        </Grid>
      );
    }
  };

  const renderListProperty = (args, name) => {
    let fields = args.filter(field =>
      field.trim().length !== 0 ? field : null
    );
    if (fields.length > 0) {
      return (
        <Grid container spacing={2} item xs={12} direction="column">
          <Typography className={classes.listTitle}>{name}</Typography>
          <ul>
            {fields.map((item, index) => (
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

  const renderAdditionalInformation = additionalInformation => {
    if (additionalInformation.trim().length !== 0) {
      return (
        <Grid
          container
          direction="column"
          justify="flex-start"
          className={classes.additionalInformationBox}
        >
          <Grid item className={classes.additionalInformationHeader}>
            <Typography variant="body2" color="primary">
              Additional Information
            </Typography>
          </Grid>
          <Grid item className={classes.additionalInformationText}>
            <Typography variant="caption">{additionalInformation}</Typography>
          </Grid>
        </Grid>
      );
    }
  };

  const renderApplyButton = () => (
    <Grid
      container
      justify="center"
      alignContent="center"
      alignItems="center"
      className={classes.applyButton}
    >
      <GradientButton
        onClick={() =>
          job.id !== "draftJobPosting" ? handleClickOpen() : () => {}
        }
        size="large"
        labelName="apply"
        text="apply for position"
      />
    </Grid>
  );

  return (
    <div className={classes.root}>
      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container justify="center" alignContent="center">
          {/* Company Card */}
          <Grid item xs={12} sm={12} md={3} lg={2}>
            <CompanyInfoCard
              logo={job.logo}
              companyName={job.companyName}
              companyLocation={job.companyLocation}
              companyWebsite={job.companyWebsite}
              companyAbout={job.companyAbout}
            />
          </Grid>

          {/* Basic Info */}
          <Grid item xs={12} sm={12} md={9} lg={10}>
            <Paper className={classes.paper}>
              {renderDate(job.date)}
              {renderJobTitle(job.title)}
              {renderJobAbout(job.about)}
              {renderListProperty(job.responsibilities, "Responsibilities")}
              {renderListProperty(
                job.educationAndExperience,
                "Education and Experience"
              )}
              {renderListProperty(job.skills, "Skills")}
              {renderListProperty(
                job.compensationAndBenefits,
                "Compensation And Benefits"
              )}
              {renderListProperty(
                job.hiringProcessSteps,
                "Hiring Process Steps"
              )}
              {renderAdditionalInformation(job.additionalInformation)}

              {renderApplyButton()}
            </Paper>
          </Grid>

          {/* Application Dialog */}
          <ApplicationDialog
            open={open}
            handleClose={handleClose}
            title={job.title}
            id={job.id}
            postedBy={job.postedBy}
            companyName={job.companyName}
          />
        </Grid>
      )}
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    // marginTop: theme.spacing(20),
    "@media (max-width: 600px)": {
      marginTop: theme.spacing(0)
    }
  },
  paper: {
    padding: theme.spacing(4),
    margin: theme.spacing(1),
    color: theme.palette.text.secondary
  },
  additionalInformationBox: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    border: "1px solid rgba(107, 19, 107, 0.2)"
  },
  spacing: {
    margin: theme.spacing(1)
  },
  applyButton: {
    marginTop: theme.spacing(3)
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
