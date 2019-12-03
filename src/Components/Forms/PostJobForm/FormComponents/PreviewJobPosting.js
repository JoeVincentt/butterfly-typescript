import React, { useContext, useEffect, useState } from "react";
import {
  PostJobDispatchContext,
  PostJobStateContext
} from "../../../../StateManagement/PostJobState";

import JobDescriptionPage from "../../../JobDescriptionPage/JobDescriptionPage";
import ButterflyLoader from "../../../Loader/ButterflyLoader";

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
    return <ButterflyLoader />;
  } else {
    return <JobDescriptionPage job={state} />;
  }
};

export default PreviewJobPosting;
