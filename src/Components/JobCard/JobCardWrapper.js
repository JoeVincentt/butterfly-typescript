import React from "react";
import { withRouter } from "react-router-dom";

import JobCard from "./JobCard";

const JobCardWrapper = props => {
  return <JobCard {...props} />;
};

export default withRouter(JobCardWrapper);
