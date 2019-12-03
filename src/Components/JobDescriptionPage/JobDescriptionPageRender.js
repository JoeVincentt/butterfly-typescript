import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import JobDescriptionPage from "./JobDescriptionPage";
import { jobs } from "../../MockUpData/jobs";

const JobDescriptionPageRender = props => {
  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(props.match.params.id);
    if (props.match.params.id !== null) {
    }
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

  if (loading) {
    return <div>loading...</div>;
  } else {
    return <JobDescriptionPage job={job} />;
  }
};

export default withRouter(JobDescriptionPageRender);
