import React, { useContext, useEffect, useState } from "react";
import {
  // PostJobDispatchContext,
  PostJobStateContext
} from "../../../StateManagement/PostJobState";

import JobDescriptionPage from "../../JobDescriptionPage/JobDescriptionPage";
import { LinearProgress } from "@material-ui/core";

const PreviewJobPosting = job => {
  const [loading, setLoading] = useState(true);
  //Use context
  const state = useContext(PostJobStateContext);
  // const dispatch = useContext(PostJobDispatchContext);

  useEffect(() => {
    setLoading(false);
  }, []);

  // return <div>preview</div>;
  if (loading) {
    return <LinearProgress />;
  } else {
    return <JobDescriptionPage job={state} />;
  }
};

export default PreviewJobPosting;
