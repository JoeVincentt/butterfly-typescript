import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import JobCard from "../../JobCard/JobCard";
import { convertTimestamp } from "../../utils/convertTimestamp";

export const renderJobsFeed = (jobs, navigateToJobDetails) => {
  if (jobs.length !== 0) {
    return jobs.map(
      (
        {
          id,
          title,
          postedBy,
          companyLocation,
          companyName,
          logo,
          date,
          advertisementPlan,
          jobType
        },
        index
      ) => (
        <JobCard
          key={id}
          id={id}
          postedBy={postedBy}
          title={title}
          companyLocation={companyLocation}
          companyName={companyName}
          logo={logo}
          advertisementPlan={advertisementPlan}
          jobType={jobType}
          date={convertTimestamp(date)}
          navigateToJobDetails={() => navigateToJobDetails(id)}
        />
      )
    );
  } else {
    return (
      <Grid container justify="center" style={{ padding: 24 }}>
        <Typography variant="body1" color="textSecondary">
          No job postings in this category available. Please check again later.
        </Typography>
      </Grid>
    );
  }
};
